#!/usr/bin/env python3
"""
NovaSanctum Cloud - Log Archiver

Store logs by timestamp/device/emotion for divine digital infrastructure
Implements secure archival and retrieval of emotional data streams

@author NovaSanctum System
@version 1.0.0
@license Divine Protocol
"""

import json
import logging
import time
import gzip
import shutil
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
import os
import hashlib
import sqlite3
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore, storage
import redis

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class ArchiveEntry:
    """Archive entry structure"""
    entry_id: str
    device_id: str
    emotion: str
    emotion_score: float
    confidence: float
    timestamp: datetime
    edge_node_id: str
    raw_data: Dict[str, Any]
    archive_path: str
    checksum: str
    compressed: bool
    size_bytes: int

@dataclass
class ArchiveQuery:
    """Archive query parameters"""
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    device_ids: Optional[List[str]] = None
    emotions: Optional[List[str]] = None
    edge_node_ids: Optional[List[str]] = None
    min_confidence: float = 0.0
    max_confidence: float = 1.0
    limit: int = 1000

class NovaSanctumLogArchiver:
    """
    NovaSanctum Log Archiver
    Stores and retrieves emotional data logs with divine security
    """
    
    def __init__(self, config_path: str = "archiver_config.json"):
        self.config = self._load_config(config_path)
        self.archive_root = Path(self.config['archive_root'])
        self.archive_root.mkdir(parents=True, exist_ok=True)
        
        # Initialize storage systems
        self.db = self._initialize_firebase()
        self.redis_client = self._initialize_redis()
        self.sqlite_db = self._initialize_sqlite()
        
        # Archive statistics
        self.archive_stats = {
            'total_entries': 0,
            'total_size_bytes': 0,
            'compressed_entries': 0,
            'last_archived': None
        }
        
        logger.info("🥀 NovaSanctum Log Archiver initialized")
    
    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """Load archiver configuration"""
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
            logger.info(f"✅ Archiver configuration loaded from {config_path}")
            return config
        except FileNotFoundError:
            logger.warning(f"⚠️ Config file {config_path} not found, using defaults")
            return {
                'archive_root': './nova_archives',
                'compression_enabled': True,
                'compression_level': 9,
                'retention_days': 365,
                'batch_size': 100,
                'firebase_project_id': 'novasanctum-cloud',
                'redis_url': 'redis://localhost:6379',
                'sqlite_db_path': './nova_archives/archive_index.db'
            }
    
    def _initialize_firebase(self) -> firestore.Client:
        """Initialize Firebase connection"""
        try:
            if not firebase_admin._apps:
                cred = credentials.Certificate(self.config.get('firebase_credentials_path', 'firebase-credentials.json'))
                firebase_admin.initialize_app(cred, {
                    'projectId': self.config['firebase_project_id']
                })
            
            db = firestore.client()
            logger.info("✅ Firebase connection established for archiver")
            return db
        except Exception as e:
            logger.error(f"❌ Failed to initialize Firebase for archiver: {e}")
            raise
    
    def _initialize_redis(self) -> redis.Redis:
        """Initialize Redis connection"""
        try:
            redis_client = redis.from_url(self.config['redis_url'])
            redis_client.ping()
            logger.info("✅ Redis connection established for archiver")
            return redis_client
        except Exception as e:
            logger.error(f"❌ Failed to initialize Redis for archiver: {e}")
            raise
    
    def _initialize_sqlite(self) -> sqlite3.Connection:
        """Initialize SQLite database for archive indexing"""
        try:
            db_path = Path(self.config['sqlite_db_path'])
            db_path.parent.mkdir(parents=True, exist_ok=True)
            
            conn = sqlite3.connect(db_path)
            
            # Create archive index table
            conn.execute('''
                CREATE TABLE IF NOT EXISTS archive_index (
                    entry_id TEXT PRIMARY KEY,
                    device_id TEXT NOT NULL,
                    emotion TEXT NOT NULL,
                    emotion_score REAL NOT NULL,
                    confidence REAL NOT NULL,
                    timestamp TEXT NOT NULL,
                    edge_node_id TEXT NOT NULL,
                    archive_path TEXT NOT NULL,
                    checksum TEXT NOT NULL,
                    compressed INTEGER NOT NULL,
                    size_bytes INTEGER NOT NULL,
                    created_at TEXT NOT NULL
                )
            ''')
            
            # Create indexes for efficient querying
            conn.execute('CREATE INDEX IF NOT EXISTS idx_device_timestamp ON archive_index(device_id, timestamp)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_emotion_timestamp ON archive_index(emotion, timestamp)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_edge_node_timestamp ON archive_index(edge_node_id, timestamp)')
            
            conn.commit()
            logger.info("✅ SQLite archive index initialized")
            return conn
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize SQLite: {e}")
            raise
    
    def archive_emotion_data(self, emotion_data: Dict[str, Any]) -> Optional[str]:
        """Archive emotion data with divine security"""
        try:
            # Generate archive entry
            entry_id = self._generate_entry_id(emotion_data)
            
            # Create archive path
            archive_path = self._create_archive_path(emotion_data, entry_id)
            
            # Prepare archive data
            archive_data = {
                'entry_id': entry_id,
                'device_id': emotion_data.get('device_id'),
                'emotion': emotion_data.get('emotion'),
                'emotion_score': emotion_data.get('emotion_score'),
                'confidence': emotion_data.get('confidence'),
                'timestamp': emotion_data.get('timestamp'),
                'edge_node_id': emotion_data.get('edge_node_id'),
                'raw_data': emotion_data.get('raw_data', {}),
                'archived_at': datetime.now().isoformat(),
                'version': '1.0.0'
            }
            
            # Compress and store data
            compressed = self.config.get('compression_enabled', True)
            stored_path, checksum, size_bytes = self._store_archive_data(
                archive_data, archive_path, compressed
            )
            
            # Create archive entry
            archive_entry = ArchiveEntry(
                entry_id=entry_id,
                device_id=emotion_data.get('device_id'),
                emotion=emotion_data.get('emotion'),
                emotion_score=emotion_data.get('emotion_score', 0.0),
                confidence=emotion_data.get('confidence', 0.0),
                timestamp=datetime.fromisoformat(emotion_data.get('timestamp')),
                edge_node_id=emotion_data.get('edge_node_id'),
                raw_data=emotion_data.get('raw_data', {}),
                archive_path=str(stored_path),
                checksum=checksum,
                compressed=compressed,
                size_bytes=size_bytes
            )
            
            # Store in SQLite index
            self._store_in_sqlite_index(archive_entry)
            
            # Store in Firebase for backup
            self._store_in_firebase_backup(archive_entry)
            
            # Cache in Redis for quick access
            self._cache_in_redis(archive_entry)
            
            # Update statistics
            self._update_archive_stats(archive_entry)
            
            logger.info(f"✅ Emotion data archived - ID: {entry_id}, Size: {size_bytes} bytes")
            return entry_id
            
        except Exception as e:
            logger.error(f"❌ Archive error: {e}")
            return None
    
    def _generate_entry_id(self, emotion_data: Dict[str, Any]) -> str:
        """Generate unique entry ID"""
        data_string = f"{emotion_data.get('device_id')}:{emotion_data.get('timestamp')}:{emotion_data.get('edge_node_id')}"
        return hashlib.sha256(data_string.encode()).hexdigest()[:16]
    
    def _create_archive_path(self, emotion_data: Dict[str, Any], entry_id: str) -> Path:
        """Create archive file path"""
        timestamp = datetime.fromisoformat(emotion_data.get('timestamp'))
        device_id = emotion_data.get('device_id')
        emotion = emotion_data.get('emotion')
        
        # Create directory structure: year/month/day/device/emotion/
        archive_dir = self.archive_root / str(timestamp.year) / f"{timestamp.month:02d}" / f"{timestamp.day:02d}" / device_id / emotion
        archive_dir.mkdir(parents=True, exist_ok=True)
        
        # Create filename
        filename = f"{entry_id}.json"
        if self.config.get('compression_enabled', True):
            filename += ".gz"
        
        return archive_dir / filename
    
    def _store_archive_data(self, archive_data: Dict[str, Any], archive_path: Path, compressed: bool) -> Tuple[Path, str, int]:
        """Store archive data with compression and checksum"""
        try:
            # Convert to JSON string
            json_data = json.dumps(archive_data, indent=2, default=str)
            
            # Compress if enabled
            if compressed:
                with gzip.open(archive_path, 'wt', compresslevel=self.config.get('compression_level', 9)) as f:
                    f.write(json_data)
            else:
                with open(archive_path, 'w') as f:
                    f.write(json_data)
            
            # Calculate checksum
            checksum = hashlib.sha256(json_data.encode()).hexdigest()
            
            # Get file size
            size_bytes = archive_path.stat().st_size
            
            return archive_path, checksum, size_bytes
            
        except Exception as e:
            logger.error(f"❌ Archive storage error: {e}")
            raise
    
    def _store_in_sqlite_index(self, archive_entry: ArchiveEntry):
        """Store archive entry in SQLite index"""
        try:
            cursor = self.sqlite_db.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO archive_index 
                (entry_id, device_id, emotion, emotion_score, confidence, timestamp, 
                 edge_node_id, archive_path, checksum, compressed, size_bytes, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                archive_entry.entry_id,
                archive_entry.device_id,
                archive_entry.emotion,
                archive_entry.emotion_score,
                archive_entry.confidence,
                archive_entry.timestamp.isoformat(),
                archive_entry.edge_node_id,
                archive_entry.archive_path,
                archive_entry.checksum,
                1 if archive_entry.compressed else 0,
                archive_entry.size_bytes,
                datetime.now().isoformat()
            ))
            
            self.sqlite_db.commit()
            
        except Exception as e:
            logger.error(f"❌ SQLite index error: {e}")
            raise
    
    def _store_in_firebase_backup(self, archive_entry: ArchiveEntry):
        """Store archive entry in Firebase as backup"""
        try:
            backup_data = {
                'entry_id': archive_entry.entry_id,
                'device_id': archive_entry.device_id,
                'emotion': archive_entry.emotion,
                'emotion_score': archive_entry.emotion_score,
                'confidence': archive_entry.confidence,
                'timestamp': archive_entry.timestamp,
                'edge_node_id': archive_entry.edge_node_id,
                'archive_path': archive_entry.archive_path,
                'checksum': archive_entry.checksum,
                'compressed': archive_entry.compressed,
                'size_bytes': archive_entry.size_bytes,
                'backup_created_at': datetime.now()
            }
            
            collection_ref = self.db.collection('archive_backup')
            doc_ref = collection_ref.document(archive_entry.entry_id)
            doc_ref.set(backup_data)
            
        except Exception as e:
            logger.error(f"❌ Firebase backup error: {e}")
            # Don't raise - backup failure shouldn't stop archiving
    
    def _cache_in_redis(self, archive_entry: ArchiveEntry):
        """Cache archive entry in Redis"""
        try:
            cache_key = f"archive_entry:{archive_entry.entry_id}"
            cache_data = {
                'device_id': archive_entry.device_id,
                'emotion': archive_entry.emotion,
                'emotion_score': archive_entry.emotion_score,
                'confidence': archive_entry.confidence,
                'timestamp': archive_entry.timestamp.isoformat(),
                'archive_path': archive_entry.archive_path
            }
            
            self.redis_client.setex(
                cache_key,
                3600,  # 1 hour
                json.dumps(cache_data)
            )
            
        except Exception as e:
            logger.error(f"❌ Redis caching error: {e}")
            # Don't raise - cache failure shouldn't stop archiving
    
    def _update_archive_stats(self, archive_entry: ArchiveEntry):
        """Update archive statistics"""
        self.archive_stats['total_entries'] += 1
        self.archive_stats['total_size_bytes'] += archive_entry.size_bytes
        if archive_entry.compressed:
            self.archive_stats['compressed_entries'] += 1
        self.archive_stats['last_archived'] = datetime.now()
    
    def query_archives(self, query: ArchiveQuery) -> List[ArchiveEntry]:
        """Query archived data based on criteria"""
        try:
            # Build SQL query
            sql_query = "SELECT * FROM archive_index WHERE 1=1"
            params = []
            
            if query.start_time:
                sql_query += " AND timestamp >= ?"
                params.append(query.start_time.isoformat())
            
            if query.end_time:
                sql_query += " AND timestamp <= ?"
                params.append(query.end_time.isoformat())
            
            if query.device_ids:
                placeholders = ','.join(['?' for _ in query.device_ids])
                sql_query += f" AND device_id IN ({placeholders})"
                params.extend(query.device_ids)
            
            if query.emotions:
                placeholders = ','.join(['?' for _ in query.emotions])
                sql_query += f" AND emotion IN ({placeholders})"
                params.extend(query.emotions)
            
            if query.edge_node_ids:
                placeholders = ','.join(['?' for _ in query.edge_node_ids])
                sql_query += f" AND edge_node_id IN ({placeholders})"
                params.extend(query.edge_node_ids)
            
            sql_query += " AND confidence >= ? AND confidence <= ?"
            params.extend([query.min_confidence, query.max_confidence])
            
            sql_query += " ORDER BY timestamp DESC LIMIT ?"
            params.append(query.limit)
            
            # Execute query
            cursor = self.sqlite_db.cursor()
            cursor.execute(sql_query, params)
            
            # Convert to ArchiveEntry objects
            entries = []
            for row in cursor.fetchall():
                entry = ArchiveEntry(
                    entry_id=row[0],
                    device_id=row[1],
                    emotion=row[2],
                    emotion_score=row[3],
                    confidence=row[4],
                    timestamp=datetime.fromisoformat(row[5]),
                    edge_node_id=row[6],
                    raw_data={},  # Will be loaded from file if needed
                    archive_path=row[7],
                    checksum=row[8],
                    compressed=bool(row[9]),
                    size_bytes=row[10]
                )
                entries.append(entry)
            
            logger.info(f"✅ Archive query returned {len(entries)} entries")
            return entries
            
        except Exception as e:
            logger.error(f"❌ Archive query error: {e}")
            return []
    
    def retrieve_archive_data(self, entry_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve archived data by entry ID"""
        try:
            # Check Redis cache first
            cache_key = f"archive_entry:{entry_id}"
            cached_data = self.redis_client.get(cache_key)
            
            if cached_data:
                logger.info(f"✅ Retrieved from cache - ID: {entry_id}")
                return json.loads(cached_data)
            
            # Query SQLite for archive path
            cursor = self.sqlite_db.cursor()
            cursor.execute("SELECT archive_path, compressed FROM archive_index WHERE entry_id = ?", (entry_id,))
            row = cursor.fetchone()
            
            if not row:
                logger.warning(f"⚠️ Archive entry not found - ID: {entry_id}")
                return None
            
            archive_path, compressed = row[0], bool(row[1])
            
            # Read and decompress data
            if compressed:
                with gzip.open(archive_path, 'rt') as f:
                    data = json.load(f)
            else:
                with open(archive_path, 'r') as f:
                    data = json.load(f)
            
            # Verify checksum
            if not self._verify_checksum(data, entry_id):
                logger.error(f"❌ Checksum verification failed - ID: {entry_id}")
                return None
            
            logger.info(f"✅ Retrieved from archive - ID: {entry_id}")
            return data
            
        except Exception as e:
            logger.error(f"❌ Archive retrieval error: {e}")
            return None
    
    def _verify_checksum(self, data: Dict[str, Any], entry_id: str) -> bool:
        """Verify data checksum"""
        try:
            cursor = self.sqlite_db.cursor()
            cursor.execute("SELECT checksum FROM archive_index WHERE entry_id = ?", (entry_id,))
            row = cursor.fetchone()
            
            if not row:
                return False
            
            stored_checksum = row[0]
            data_string = json.dumps(data, sort_keys=True)
            calculated_checksum = hashlib.sha256(data_string.encode()).hexdigest()
            
            return stored_checksum == calculated_checksum
            
        except Exception as e:
            logger.error(f"❌ Checksum verification error: {e}")
            return False
    
    def cleanup_old_archives(self, retention_days: Optional[int] = None) -> int:
        """Clean up archives older than retention period"""
        try:
            if retention_days is None:
                retention_days = self.config.get('retention_days', 365)
            
            cutoff_date = datetime.now() - timedelta(days=retention_days)
            
            # Find old entries
            cursor = self.sqlite_db.cursor()
            cursor.execute("SELECT entry_id, archive_path FROM archive_index WHERE timestamp < ?", (cutoff_date.isoformat(),))
            old_entries = cursor.fetchall()
            
            deleted_count = 0
            for entry_id, archive_path in old_entries:
                try:
                    # Delete file
                    if os.path.exists(archive_path):
                        os.remove(archive_path)
                    
                    # Delete from SQLite
                    cursor.execute("DELETE FROM archive_index WHERE entry_id = ?", (entry_id,))
                    
                    # Delete from Redis cache
                    cache_key = f"archive_entry:{entry_id}"
                    self.redis_client.delete(cache_key)
                    
                    deleted_count += 1
                    
                except Exception as e:
                    logger.error(f"❌ Failed to delete archive entry {entry_id}: {e}")
            
            self.sqlite_db.commit()
            
            logger.info(f"✅ Cleaned up {deleted_count} old archive entries")
            return deleted_count
            
        except Exception as e:
            logger.error(f"❌ Archive cleanup error: {e}")
            return 0
    
    def get_archive_stats(self) -> Dict[str, Any]:
        """Get archive statistics"""
        try:
            cursor = self.sqlite_db.cursor()
            cursor.execute("SELECT COUNT(*), SUM(size_bytes) FROM archive_index")
            row = cursor.fetchone()
            
            total_entries = row[0] if row[0] else 0
            total_size = row[1] if row[1] else 0
            
            return {
                'timestamp': datetime.now().isoformat(),
                'total_entries': total_entries,
                'total_size_bytes': total_size,
                'total_size_mb': total_size / (1024 * 1024),
                'compressed_entries': self.archive_stats['compressed_entries'],
                'last_archived': self.archive_stats['last_archived'].isoformat() if self.archive_stats['last_archived'] else None,
                'retention_days': self.config.get('retention_days', 365)
            }
            
        except Exception as e:
            logger.error(f"❌ Archive stats error: {e}")
            return {}

def main():
    """Main entry point for testing"""
    print("🥀 NovaSanctum Log Archiver - Divine Digital Infrastructure")
    print("=" * 60)
    
    try:
        archiver = NovaSanctumLogArchiver()
        
        # Test archiving
        test_data = {
            'device_id': 'nova_tiny_001',
            'emotion': 'calm',
            'emotion_score': 0.85,
            'confidence': 0.92,
            'timestamp': datetime.now().isoformat(),
            'edge_node_id': 'edge_node_001',
            'raw_data': {'test': 'data'}
        }
        
        entry_id = archiver.archive_emotion_data(test_data)
        if entry_id:
            print(f"✅ Test data archived with ID: {entry_id}")
            
            # Test retrieval
            retrieved_data = archiver.retrieve_archive_data(entry_id)
            if retrieved_data:
                print(f"✅ Test data retrieved successfully")
            
            # Test query
            query = ArchiveQuery(
                device_ids=['nova_tiny_001'],
                emotions=['calm'],
                limit=10
            )
            entries = archiver.query_archives(query)
            print(f"✅ Query returned {len(entries)} entries")
            
            # Get stats
            stats = archiver.get_archive_stats()
            print(f"✅ Archive stats: {stats}")
        
    except Exception as e:
        logger.error(f"❌ Archiver test error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main()) 