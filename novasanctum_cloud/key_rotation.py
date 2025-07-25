#!/usr/bin/env python3
"""
NovaSanctum Cloud - Key Rotation System

Secure cryptographic key handling for divine digital infrastructure
Implements automatic key rotation and secure key management

@author NovaSanctum System
@version 1.0.0
@license Divine Protocol
"""

import json
import logging
import time
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization
import firebase_admin
from firebase_admin import credentials, firestore
import redis

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class KeyInfo:
    """Key information structure"""
    key_id: str
    key_type: str  # 'fernet', 'rsa', 'hmac'
    created_at: datetime
    expires_at: datetime
    status: str  # 'active', 'expired', 'revoked'
    usage_count: int
    last_used: Optional[datetime]
    key_hash: str
    metadata: Dict[str, Any]

@dataclass
class KeyRotationPolicy:
    """Key rotation policy configuration"""
    fernet_rotation_days: int = 30
    rsa_rotation_days: int = 90
    hmac_rotation_days: int = 60
    max_key_usage: int = 1000000
    backup_keys_count: int = 2
    auto_rotation_enabled: bool = True
    emergency_rotation_enabled: bool = True

class NovaSanctumKeyRotation:
    """
    NovaSanctum Key Rotation System
    Manages cryptographic keys with divine security protocols
    """
    
    def __init__(self, config_path: str = "key_rotation_config.json"):
        self.config = self._load_config(config_path)
        self.policy = KeyRotationPolicy(**self.config.get('policy', {}))
        
        # Initialize storage systems
        self.db = self._initialize_firebase()
        self.redis_client = self._initialize_redis()
        
        # Key storage
        self.active_keys = {}
        self.key_cache = {}
        
        # Load existing keys
        self._load_active_keys()
        
        logger.info("🥀 NovaSanctum Key Rotation System initialized")
    
    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """Load key rotation configuration"""
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
            logger.info(f"✅ Key rotation configuration loaded from {config_path}")
            return config
        except FileNotFoundError:
            logger.warning(f"⚠️ Config file {config_path} not found, using defaults")
            return {
                'firebase_project_id': 'novasanctum-cloud',
                'redis_url': 'redis://localhost:6379',
                'key_storage_path': './secure_keys',
                'policy': {
                    'fernet_rotation_days': 30,
                    'rsa_rotation_days': 90,
                    'hmac_rotation_days': 60,
                    'max_key_usage': 1000000,
                    'backup_keys_count': 2,
                    'auto_rotation_enabled': True,
                    'emergency_rotation_enabled': True
                }
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
            logger.info("✅ Firebase connection established for key rotation")
            return db
        except Exception as e:
            logger.error(f"❌ Failed to initialize Firebase for key rotation: {e}")
            raise
    
    def _initialize_redis(self) -> redis.Redis:
        """Initialize Redis connection"""
        try:
            redis_client = redis.from_url(self.config['redis_url'])
            redis_client.ping()
            logger.info("✅ Redis connection established for key rotation")
            return redis_client
        except Exception as e:
            logger.error(f"❌ Failed to initialize Redis for key rotation: {e}")
            raise
    
    def _load_active_keys(self):
        """Load active keys from storage"""
        try:
            # Load from Firebase
            collection_ref = self.db.collection('cryptographic_keys')
            docs = collection_ref.where('status', '==', 'active').stream()
            
            for doc in docs:
                key_data = doc.to_dict()
                key_info = KeyInfo(
                    key_id=key_data['key_id'],
                    key_type=key_data['key_type'],
                    created_at=key_data['created_at'],
                    expires_at=key_data['expires_at'],
                    status=key_data['status'],
                    usage_count=key_data.get('usage_count', 0),
                    last_used=key_data.get('last_used'),
                    key_hash=key_data['key_hash'],
                    metadata=key_data.get('metadata', {})
                )
                
                self.active_keys[key_info.key_id] = key_info
            
            logger.info(f"✅ Loaded {len(self.active_keys)} active keys")
            
        except Exception as e:
            logger.error(f"❌ Failed to load active keys: {e}")
    
    def generate_fernet_key(self, key_id: Optional[str] = None) -> Tuple[str, bytes]:
        """Generate a new Fernet key"""
        try:
            if key_id is None:
                key_id = f"fernet_{int(time.time())}"
            
            # Generate Fernet key
            key = Fernet.generate_key()
            
            # Create key info
            key_info = KeyInfo(
                key_id=key_id,
                key_type='fernet',
                created_at=datetime.now(),
                expires_at=datetime.now() + timedelta(days=self.policy.fernet_rotation_days),
                status='active',
                usage_count=0,
                last_used=None,
                key_hash=hashlib.sha256(key).hexdigest(),
                metadata={'algorithm': 'AES-256', 'mode': 'CBC'}
            )
            
            # Store key info
            self._store_key_info(key_info)
            
            # Store actual key securely
            self._store_secure_key(key_id, key)
            
            logger.info(f"✅ Generated Fernet key: {key_id}")
            return key_id, key
            
        except Exception as e:
            logger.error(f"❌ Fernet key generation error: {e}")
            raise
    
    def generate_rsa_keypair(self, key_id: Optional[str] = None) -> Tuple[str, rsa.RSAPrivateKey, rsa.RSAPublicKey]:
        """Generate a new RSA keypair"""
        try:
            if key_id is None:
                key_id = f"rsa_{int(time.time())}"
            
            # Generate RSA keypair
            private_key = rsa.generate_private_key(
                public_exponent=65537,
                key_size=2048
            )
            public_key = private_key.public_key()
            
            # Create key info
            key_info = KeyInfo(
                key_id=key_id,
                key_type='rsa',
                created_at=datetime.now(),
                expires_at=datetime.now() + timedelta(days=self.policy.rsa_rotation_days),
                status='active',
                usage_count=0,
                last_used=None,
                key_hash=hashlib.sha256(public_key.public_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PublicFormat.SubjectPublicKeyInfo
                )).hexdigest(),
                metadata={'key_size': 2048, 'algorithm': 'RSA'}
            )
            
            # Store key info
            self._store_key_info(key_info)
            
            # Store private key securely
            private_key_bytes = private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            )
            self._store_secure_key(key_id, private_key_bytes)
            
            logger.info(f"✅ Generated RSA keypair: {key_id}")
            return key_id, private_key, public_key
            
        except Exception as e:
            logger.error(f"❌ RSA keypair generation error: {e}")
            raise
    
    def generate_hmac_key(self, key_id: Optional[str] = None) -> Tuple[str, bytes]:
        """Generate a new HMAC key"""
        try:
            if key_id is None:
                key_id = f"hmac_{int(time.time())}"
            
            # Generate HMAC key
            key = secrets.token_bytes(32)  # 256-bit key
            
            # Create key info
            key_info = KeyInfo(
                key_id=key_id,
                key_type='hmac',
                created_at=datetime.now(),
                expires_at=datetime.now() + timedelta(days=self.policy.hmac_rotation_days),
                status='active',
                usage_count=0,
                last_used=None,
                key_hash=hashlib.sha256(key).hexdigest(),
                metadata={'algorithm': 'HMAC-SHA256', 'key_size': 256}
            )
            
            # Store key info
            self._store_key_info(key_info)
            
            # Store actual key securely
            self._store_secure_key(key_id, key)
            
            logger.info(f"✅ Generated HMAC key: {key_id}")
            return key_id, key
            
        except Exception as e:
            logger.error(f"❌ HMAC key generation error: {e}")
            raise
    
    def _store_key_info(self, key_info: KeyInfo):
        """Store key information in Firebase"""
        try:
            key_data = {
                'key_id': key_info.key_id,
                'key_type': key_info.key_type,
                'created_at': key_info.created_at,
                'expires_at': key_info.expires_at,
                'status': key_info.status,
                'usage_count': key_info.usage_count,
                'last_used': key_info.last_used,
                'key_hash': key_info.key_hash,
                'metadata': key_info.metadata
            }
            
            collection_ref = self.db.collection('cryptographic_keys')
            doc_ref = collection_ref.document(key_info.key_id)
            doc_ref.set(key_data)
            
            # Update active keys cache
            self.active_keys[key_info.key_id] = key_info
            
        except Exception as e:
            logger.error(f"❌ Key info storage error: {e}")
            raise
    
    def _store_secure_key(self, key_id: str, key_data: bytes):
        """Store actual key data securely"""
        try:
            # Store in Redis with expiration
            cache_key = f"secure_key:{key_id}"
            self.redis_client.setex(
                cache_key,
                3600,  # 1 hour cache
                key_data
            )
            
            # Also store in local cache
            self.key_cache[key_id] = key_data
            
        except Exception as e:
            logger.error(f"❌ Secure key storage error: {e}")
            raise
    
    def get_key(self, key_id: str) -> Optional[bytes]:
        """Retrieve key data"""
        try:
            # Check local cache first
            if key_id in self.key_cache:
                return self.key_cache[key_id]
            
            # Check Redis cache
            cache_key = f"secure_key:{key_id}"
            key_data = self.redis_client.get(cache_key)
            
            if key_data:
                self.key_cache[key_id] = key_data
                return key_data
            
            # Key not found
            logger.warning(f"⚠️ Key not found: {key_id}")
            return None
            
        except Exception as e:
            logger.error(f"❌ Key retrieval error: {e}")
            return None
    
    def get_active_key(self, key_type: str) -> Optional[Tuple[str, bytes]]:
        """Get the most recent active key of specified type"""
        try:
            active_keys = [
                key_info for key_info in self.active_keys.values()
                if key_info.key_type == key_type and key_info.status == 'active'
            ]
            
            if not active_keys:
                logger.warning(f"⚠️ No active {key_type} keys found")
                return None
            
            # Get the most recent key
            latest_key = max(active_keys, key=lambda k: k.created_at)
            
            # Retrieve key data
            key_data = self.get_key(latest_key.key_id)
            if key_data:
                return latest_key.key_id, key_data
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Active key retrieval error: {e}")
            return None
    
    def rotate_keys(self, key_type: Optional[str] = None) -> List[str]:
        """Rotate keys of specified type or all types"""
        try:
            rotated_keys = []
            
            if key_type:
                key_types = [key_type]
            else:
                key_types = ['fernet', 'rsa', 'hmac']
            
            for kt in key_types:
                # Generate new key
                if kt == 'fernet':
                    key_id, _ = self.generate_fernet_key()
                elif kt == 'rsa':
                    key_id, _, _ = self.generate_rsa_keypair()
                elif kt == 'hmac':
                    key_id, _ = self.generate_hmac_key()
                else:
                    continue
                
                rotated_keys.append(key_id)
                
                # Mark old keys as expired
                self._expire_old_keys(kt)
            
            logger.info(f"✅ Rotated keys: {rotated_keys}")
            return rotated_keys
            
        except Exception as e:
            logger.error(f"❌ Key rotation error: {e}")
            return []
    
    def _expire_old_keys(self, key_type: str):
        """Mark old keys as expired"""
        try:
            for key_info in self.active_keys.values():
                if (key_info.key_type == key_type and 
                    key_info.status == 'active' and 
                    key_info.expires_at < datetime.now()):
                    
                    # Update status
                    key_info.status = 'expired'
                    self._store_key_info(key_info)
                    
                    # Remove from cache
                    if key_info.key_id in self.key_cache:
                        del self.key_cache[key_info.key_id]
                    
                    cache_key = f"secure_key:{key_info.key_id}"
                    self.redis_client.delete(cache_key)
                    
                    logger.info(f"✅ Expired key: {key_info.key_id}")
            
        except Exception as e:
            logger.error(f"❌ Key expiration error: {e}")
    
    def emergency_rotation(self) -> List[str]:
        """Emergency key rotation - revokes all keys and generates new ones"""
        try:
            if not self.policy.emergency_rotation_enabled:
                logger.warning("⚠️ Emergency rotation disabled")
                return []
            
            logger.warning("🚨 EMERGENCY KEY ROTATION INITIATED")
            
            # Revoke all active keys
            for key_info in self.active_keys.values():
                if key_info.status == 'active':
                    key_info.status = 'revoked'
                    self._store_key_info(key_info)
                    
                    # Remove from cache
                    if key_info.key_id in self.key_cache:
                        del self.key_cache[key_info.key_id]
                    
                    cache_key = f"secure_key:{key_info.key_id}"
                    self.redis_client.delete(cache_key)
            
            # Generate new keys
            new_keys = self.rotate_keys()
            
            logger.warning(f"🚨 Emergency rotation completed - {len(new_keys)} new keys generated")
            return new_keys
            
        except Exception as e:
            logger.error(f"❌ Emergency rotation error: {e}")
            return []
    
    def check_key_health(self) -> Dict[str, Any]:
        """Check health of all keys"""
        try:
            health_report = {
                'timestamp': datetime.now().isoformat(),
                'total_keys': len(self.active_keys),
                'active_keys': 0,
                'expired_keys': 0,
                'revoked_keys': 0,
                'key_types': {},
                'rotation_needed': False,
                'warnings': []
            }
            
            for key_info in self.active_keys.values():
                if key_info.status == 'active':
                    health_report['active_keys'] += 1
                    
                    # Check if rotation is needed
                    days_until_expiry = (key_info.expires_at - datetime.now()).days
                    if days_until_expiry <= 7:
                        health_report['rotation_needed'] = True
                        health_report['warnings'].append(f"Key {key_info.key_id} expires in {days_until_expiry} days")
                    
                    # Count by type
                    if key_info.key_type not in health_report['key_types']:
                        health_report['key_types'][key_info.key_type] = 0
                    health_report['key_types'][key_info.key_type] += 1
                    
                elif key_info.status == 'expired':
                    health_report['expired_keys'] += 1
                elif key_info.status == 'revoked':
                    health_report['revoked_keys'] += 1
            
            return health_report
            
        except Exception as e:
            logger.error(f"❌ Key health check error: {e}")
            return {'error': str(e)}
    
    def cleanup_expired_keys(self) -> int:
        """Clean up expired and revoked keys"""
        try:
            cleanup_count = 0
            
            for key_info in list(self.active_keys.values()):
                if key_info.status in ['expired', 'revoked']:
                    # Remove from Firebase
                    collection_ref = self.db.collection('cryptographic_keys')
                    doc_ref = collection_ref.document(key_info.key_id)
                    doc_ref.delete()
                    
                    # Remove from cache
                    if key_info.key_id in self.key_cache:
                        del self.key_cache[key_info.key_id]
                    
                    # Remove from Redis
                    cache_key = f"secure_key:{key_info.key_id}"
                    self.redis_client.delete(cache_key)
                    
                    # Remove from active keys
                    del self.active_keys[key_info.key_id]
                    
                    cleanup_count += 1
            
            logger.info(f"✅ Cleaned up {cleanup_count} expired/revoked keys")
            return cleanup_count
            
        except Exception as e:
            logger.error(f"❌ Key cleanup error: {e}")
            return 0

def main():
    """Main entry point for testing"""
    print("🥀 NovaSanctum Key Rotation System - Divine Digital Infrastructure")
    print("=" * 65)
    
    try:
        key_rotation = NovaSanctumKeyRotation()
        
        # Test key generation
        fernet_key_id, fernet_key = key_rotation.generate_fernet_key()
        print(f"✅ Generated Fernet key: {fernet_key_id}")
        
        rsa_key_id, private_key, public_key = key_rotation.generate_rsa_keypair()
        print(f"✅ Generated RSA keypair: {rsa_key_id}")
        
        hmac_key_id, hmac_key = key_rotation.generate_hmac_key()
        print(f"✅ Generated HMAC key: {hmac_key_id}")
        
        # Test key retrieval
        retrieved_fernet = key_rotation.get_key(fernet_key_id)
        if retrieved_fernet == fernet_key:
            print("✅ Fernet key retrieval successful")
        
        # Test active key retrieval
        active_fernet = key_rotation.get_active_key('fernet')
        if active_fernet:
            print(f"✅ Active Fernet key: {active_fernet[0]}")
        
        # Check key health
        health = key_rotation.check_key_health()
        print(f"✅ Key health: {health}")
        
        # Test key rotation
        rotated = key_rotation.rotate_keys('fernet')
        print(f"✅ Rotated Fernet keys: {rotated}")
        
    except Exception as e:
        logger.error(f"❌ Key rotation test error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main()) 