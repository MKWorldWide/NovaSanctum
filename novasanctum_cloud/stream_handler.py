#!/usr/bin/env python3
"""
NovaSanctum Cloud - Stream Handler

Flask/Firebase function for stream ingestion from NovaTiny agents
Processes emotional data streams and stores them securely

@author NovaSanctum System
@version 1.0.0
@license Divine Protocol
"""

import json
import logging
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import firebase_admin
from firebase_admin import credentials, firestore, storage
from flask import Flask, request, jsonify
import redis
import hashlib
import hmac
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class StreamData:
    """Stream data structure from edge nodes"""
    edge_node_id: str
    timestamp: datetime
    emotion_data: Dict[str, Any]
    device_id: str
    emotion: str
    emotion_score: float
    confidence: float

@dataclass
class ProcessingResult:
    """Result of stream processing"""
    success: bool
    message: str
    data_id: Optional[str] = None
    processing_time: float = 0.0

class NovaSanctumStreamHandler:
    """
    NovaSanctum Cloud Stream Handler
    Processes emotional data streams from edge nodes
    """
    
    def __init__(self, config_path: str = "cloud_config.json"):
        self.config = self._load_config(config_path)
        self.db = self._initialize_firebase()
        self.redis_client = self._initialize_redis()
        self.processing_stats = {
            'total_processed': 0,
            'successful': 0,
            'failed': 0,
            'last_processed': None
        }
        
        logger.info("🥀 NovaSanctum Stream Handler initialized")
    
    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """Load cloud configuration"""
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
            logger.info(f"✅ Cloud configuration loaded from {config_path}")
            return config
        except FileNotFoundError:
            logger.warning(f"⚠️ Config file {config_path} not found, using defaults")
            return {
                'firebase_project_id': 'novasanctum-cloud',
                'redis_url': 'redis://localhost:6379',
                'max_batch_size': 100,
                'processing_timeout': 30,
                'encryption_enabled': True,
                'rate_limiting': {
                    'max_requests_per_minute': 1000,
                    'max_requests_per_hour': 10000
                }
            }
    
    def _initialize_firebase(self) -> firestore.Client:
        """Initialize Firebase connection"""
        try:
            # Initialize Firebase Admin SDK
            if not firebase_admin._apps:
                cred = credentials.Certificate(self.config.get('firebase_credentials_path', 'firebase-credentials.json'))
                firebase_admin.initialize_app(cred, {
                    'projectId': self.config['firebase_project_id']
                })
            
            db = firestore.client()
            logger.info("✅ Firebase connection established")
            return db
        except Exception as e:
            logger.error(f"❌ Failed to initialize Firebase: {e}")
            raise
    
    def _initialize_redis(self) -> redis.Redis:
        """Initialize Redis connection"""
        try:
            redis_client = redis.from_url(self.config['redis_url'])
            redis_client.ping()  # Test connection
            logger.info("✅ Redis connection established")
            return redis_client
        except Exception as e:
            logger.error(f"❌ Failed to initialize Redis: {e}")
            raise
    
    def process_stream_data(self, stream_data: StreamData) -> ProcessingResult:
        """Process incoming stream data"""
        start_time = time.time()
        
        try:
            # Validate stream data
            if not self._validate_stream_data(stream_data):
                return ProcessingResult(
                    success=False,
                    message="Invalid stream data",
                    processing_time=time.time() - start_time
                )
            
            # Rate limiting check
            if not self._check_rate_limit(stream_data.edge_node_id):
                return ProcessingResult(
                    success=False,
                    message="Rate limit exceeded",
                    processing_time=time.time() - start_time
                )
            
            # Generate unique data ID
            data_id = self._generate_data_id(stream_data)
            
            # Store in Firebase
            firebase_success = self._store_in_firebase(stream_data, data_id)
            if not firebase_success:
                return ProcessingResult(
                    success=False,
                    message="Failed to store in Firebase",
                    processing_time=time.time() - start_time
                )
            
            # Cache in Redis for quick access
            redis_success = self._cache_in_redis(stream_data, data_id)
            if not redis_success:
                logger.warning("⚠️ Failed to cache in Redis, but data stored in Firebase")
            
            # Update processing statistics
            self._update_stats(True)
            
            processing_time = time.time() - start_time
            logger.info(f"✅ Stream data processed successfully - ID: {data_id}, Time: {processing_time:.3f}s")
            
            return ProcessingResult(
                success=True,
                message="Data processed successfully",
                data_id=data_id,
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"❌ Stream processing error: {e}")
            self._update_stats(False)
            
            return ProcessingResult(
                success=False,
                message=f"Processing error: {str(e)}",
                processing_time=time.time() - start_time
            )
    
    def _validate_stream_data(self, stream_data: StreamData) -> bool:
        """Validate incoming stream data"""
        try:
            # Check required fields
            if not stream_data.edge_node_id or not stream_data.device_id:
                return False
            
            # Check emotion data
            if not stream_data.emotion or stream_data.emotion_score < 0 or stream_data.emotion_score > 1:
                return False
            
            # Check confidence
            if stream_data.confidence < 0 or stream_data.confidence > 1:
                return False
            
            # Check timestamp (not too old)
            if stream_data.timestamp < datetime.now() - timedelta(hours=24):
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Data validation error: {e}")
            return False
    
    def _check_rate_limit(self, edge_node_id: str) -> bool:
        """Check rate limiting for edge node"""
        try:
            current_time = int(time.time())
            minute_key = f"rate_limit:{edge_node_id}:{current_time // 60}"
            hour_key = f"rate_limit:{edge_node_id}:{current_time // 3600}"
            
            # Check minute limit
            minute_count = self.redis_client.get(minute_key)
            if minute_count and int(minute_count) >= self.config['rate_limiting']['max_requests_per_minute']:
                return False
            
            # Check hour limit
            hour_count = self.redis_client.get(hour_key)
            if hour_count and int(hour_count) >= self.config['rate_limiting']['max_requests_per_hour']:
                return False
            
            # Increment counters
            self.redis_client.incr(minute_key, 1)
            self.redis_client.expire(minute_key, 60)
            
            self.redis_client.incr(hour_key, 1)
            self.redis_client.expire(hour_key, 3600)
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Rate limiting error: {e}")
            return True  # Allow if rate limiting fails
    
    def _generate_data_id(self, stream_data: StreamData) -> str:
        """Generate unique data ID"""
        data_string = f"{stream_data.edge_node_id}:{stream_data.device_id}:{stream_data.timestamp.isoformat()}"
        return hashlib.sha256(data_string.encode()).hexdigest()[:16]
    
    def _store_in_firebase(self, stream_data: StreamData, data_id: str) -> bool:
        """Store stream data in Firebase"""
        try:
            # Prepare document data
            doc_data = {
                'data_id': data_id,
                'edge_node_id': stream_data.edge_node_id,
                'device_id': stream_data.device_id,
                'emotion': stream_data.emotion,
                'emotion_score': stream_data.emotion_score,
                'confidence': stream_data.confidence,
                'timestamp': stream_data.timestamp,
                'raw_data': stream_data.emotion_data,
                'processed_at': datetime.now(),
                'version': '1.0.0'
            }
            
            # Store in Firestore
            collection_ref = self.db.collection('emotion_streams')
            doc_ref = collection_ref.document(data_id)
            doc_ref.set(doc_data)
            
            # Also store in time-series collection for analytics
            date_str = stream_data.timestamp.strftime('%Y-%m-%d')
            time_series_ref = self.db.collection('emotion_analytics').document(date_str)
            time_series_ref.update({
                f'data.{data_id}': doc_data
            })
            
            logger.info(f"✅ Data stored in Firebase - ID: {data_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Firebase storage error: {e}")
            return False
    
    def _cache_in_redis(self, stream_data: StreamData, data_id: str) -> bool:
        """Cache stream data in Redis for quick access"""
        try:
            # Cache recent data (last 24 hours)
            cache_key = f"emotion_data:{data_id}"
            cache_data = {
                'device_id': stream_data.device_id,
                'emotion': stream_data.emotion,
                'emotion_score': stream_data.emotion_score,
                'confidence': stream_data.confidence,
                'timestamp': stream_data.timestamp.isoformat()
            }
            
            self.redis_client.setex(
                cache_key,
                86400,  # 24 hours
                json.dumps(cache_data)
            )
            
            # Update device status
            device_key = f"device_status:{stream_data.device_id}"
            device_status = {
                'last_seen': stream_data.timestamp.isoformat(),
                'current_emotion': stream_data.emotion,
                'emotion_score': stream_data.emotion_score,
                'edge_node': stream_data.edge_node_id
            }
            
            self.redis_client.setex(
                device_key,
                3600,  # 1 hour
                json.dumps(device_status)
            )
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Redis caching error: {e}")
            return False
    
    def _update_stats(self, success: bool):
        """Update processing statistics"""
        self.processing_stats['total_processed'] += 1
        if success:
            self.processing_stats['successful'] += 1
        else:
            self.processing_stats['failed'] += 1
        
        self.processing_stats['last_processed'] = datetime.now()
    
    def get_processing_stats(self) -> Dict[str, Any]:
        """Get processing statistics"""
        return {
            'timestamp': datetime.now().isoformat(),
            'stats': self.processing_stats,
            'success_rate': (
                self.processing_stats['successful'] / self.processing_stats['total_processed']
                if self.processing_stats['total_processed'] > 0 else 0
            )
        }
    
    def get_device_status(self, device_id: str) -> Optional[Dict[str, Any]]:
        """Get current status of a device"""
        try:
            device_key = f"device_status:{device_id}"
            device_data = self.redis_client.get(device_key)
            
            if device_data:
                return json.loads(device_data)
            else:
                return None
                
        except Exception as e:
            logger.error(f"❌ Error getting device status: {e}")
            return None

# Flask application
app = Flask(__name__)
stream_handler = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'NovaSanctum Stream Handler'
    })

@app.route('/stream', methods=['POST'])
def handle_stream():
    """Handle incoming stream data"""
    try:
        # Parse request data
        request_data = request.get_json()
        
        if not request_data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Create stream data object
        stream_data = StreamData(
            edge_node_id=request_data.get('edge_node_id'),
            timestamp=datetime.fromisoformat(request_data.get('timestamp')),
            emotion_data=request_data.get('emotion_data', {}),
            device_id=request_data.get('emotion_data', {}).get('device_id'),
            emotion=request_data.get('emotion_data', {}).get('emotion'),
            emotion_score=request_data.get('emotion_data', {}).get('emotion_score', 0.0),
            confidence=request_data.get('emotion_data', {}).get('confidence', 0.0)
        )
        
        # Process stream data
        result = stream_handler.process_stream_data(stream_data)
        
        if result.success:
            return jsonify({
                'success': True,
                'data_id': result.data_id,
                'processing_time': result.processing_time,
                'message': result.message
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.message,
                'processing_time': result.processing_time
            }), 400
            
    except Exception as e:
        logger.error(f"❌ Stream handler error: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    """Get processing statistics"""
    try:
        stats = stream_handler.get_processing_stats()
        return jsonify(stats), 200
    except Exception as e:
        logger.error(f"❌ Stats error: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/device/<device_id>/status', methods=['GET'])
def get_device_status(device_id):
    """Get device status"""
    try:
        status = stream_handler.get_device_status(device_id)
        if status:
            return jsonify(status), 200
        else:
            return jsonify({'error': 'Device not found'}), 404
    except Exception as e:
        logger.error(f"❌ Device status error: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

def initialize_app():
    """Initialize the Flask application"""
    global stream_handler
    
    try:
        stream_handler = NovaSanctumStreamHandler()
        logger.info("✅ NovaSanctum Stream Handler Flask app initialized")
    except Exception as e:
        logger.error(f"❌ Failed to initialize app: {e}")
        raise

if __name__ == "__main__":
    initialize_app()
    app.run(host='0.0.0.0', port=5000, debug=False) 