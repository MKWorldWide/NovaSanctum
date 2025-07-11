#!/usr/bin/env python3
"""
Nova Edge Node - BLE/Wi-Fi Listener and Data Forwarder

Divine digital infrastructure for edge AI sovereignty
Listens for NovaTiny agent packets, decrypts them, and forwards to cloud

@author NovaSanctum System
@version 1.0.0
@license Divine Protocol
"""

import json
import time
import logging
import threading
import queue
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import socket
import ssl
import requests
from cryptography.fernet import Fernet
import asyncio
import websockets

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('nova_edge_node.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class DeviceInfo:
    """Device information for registered NovaTiny agents"""
    device_id: str
    public_key: str
    last_seen: datetime
    status: str  # 'active', 'inactive', 'suspended'
    location: Optional[str] = None
    capabilities: List[str] = None

@dataclass
class EmotionData:
    """Emotion data structure from NovaTiny agents"""
    device_id: str
    emotion: str
    emotion_score: float
    confidence: float
    timestamp: datetime
    raw_data: Dict[str, Any]

class NovaEdgeNode:
    """
    Nova Edge Node - Main controller for BLE/Wi-Fi listening and data forwarding
    """
    
    def __init__(self, config_path: str = "config.json"):
        self.config = self._load_config(config_path)
        self.device_registry = self._load_device_registry()
        self.encryption_key = self._load_encryption_key()
        self.fernet = Fernet(self.encryption_key)
        
        # Communication queues
        self.ble_queue = queue.Queue()
        self.wifi_queue = queue.Queue()
        self.cloud_queue = queue.Queue()
        
        # Threading
        self.running = False
        self.threads = []
        
        # Statistics
        self.stats = {
            'packets_received': 0,
            'packets_forwarded': 0,
            'packets_failed': 0,
            'devices_active': 0,
            'last_heartbeat': datetime.now()
        }
        
        logger.info("🥀 Nova Edge Node initialized")
    
    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """Load configuration from JSON file"""
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
            logger.info(f"✅ Configuration loaded from {config_path}")
            return config
        except FileNotFoundError:
            logger.warning(f"⚠️ Config file {config_path} not found, using defaults")
            return {
                'ble_enabled': True,
                'wifi_enabled': True,
                'cloud_endpoint': 'https://api.novasanctum.com/stream',
                'heartbeat_interval': 30,
                'max_retries': 3,
                'encryption_enabled': True
            }
    
    def _load_device_registry(self) -> Dict[str, DeviceInfo]:
        """Load device registry from JSON file"""
        try:
            with open('device_registry.json', 'r') as f:
                registry_data = json.load(f)
            
            registry = {}
            for device_id, data in registry_data.items():
                registry[device_id] = DeviceInfo(
                    device_id=device_id,
                    public_key=data['public_key'],
                    last_seen=datetime.fromisoformat(data['last_seen']),
                    status=data['status'],
                    location=data.get('location'),
                    capabilities=data.get('capabilities', [])
                )
            
            logger.info(f"✅ Device registry loaded with {len(registry)} devices")
            return registry
        except FileNotFoundError:
            logger.warning("⚠️ Device registry not found, creating empty registry")
            return {}
    
    def _load_encryption_key(self) -> bytes:
        """Load encryption key from file"""
        try:
            with open('fernet_key.txt', 'rb') as f:
                key = f.read()
            logger.info("✅ Encryption key loaded")
            return key
        except FileNotFoundError:
            logger.warning("⚠️ Encryption key not found, generating new key")
            key = Fernet.generate_key()
            with open('fernet_key.txt', 'wb') as f:
                f.write(key)
            logger.info("✅ New encryption key generated and saved")
            return key
    
    def start(self):
        """Start the Nova Edge Node"""
        logger.info("🚀 Starting Nova Edge Node...")
        self.running = True
        
        # Start listening threads
        if self.config.get('ble_enabled', True):
            ble_thread = threading.Thread(target=self._ble_listener, daemon=True)
            ble_thread.start()
            self.threads.append(ble_thread)
            logger.info("📡 BLE listener started")
        
        if self.config.get('wifi_enabled', True):
            wifi_thread = threading.Thread(target=self._wifi_listener, daemon=True)
            wifi_thread.start()
            self.threads.append(wifi_thread)
            logger.info("📡 WiFi listener started")
        
        # Start processing threads
        processor_thread = threading.Thread(target=self._data_processor, daemon=True)
        processor_thread.start()
        self.threads.append(processor_thread)
        
        cloud_thread = threading.Thread(target=self._cloud_forwarder, daemon=True)
        cloud_thread.start()
        self.threads.append(cloud_thread)
        
        # Start heartbeat thread
        heartbeat_thread = threading.Thread(target=self._heartbeat_monitor, daemon=True)
        heartbeat_thread.start()
        self.threads.append(heartbeat_thread)
        
        logger.info("✅ Nova Edge Node started successfully")
    
    def stop(self):
        """Stop the Nova Edge Node"""
        logger.info("🛑 Stopping Nova Edge Node...")
        self.running = False
        
        # Wait for threads to finish
        for thread in self.threads:
            thread.join(timeout=5)
        
        # Save final statistics
        self._save_stats()
        logger.info("✅ Nova Edge Node stopped")
    
    def _ble_listener(self):
        """BLE listener thread - simulates listening for BLE packets"""
        logger.info("📡 BLE listener thread started")
        
        while self.running:
            try:
                # Simulate BLE packet reception
                if self._simulate_ble_packet():
                    packet = self._generate_simulated_packet('ble')
                    self.ble_queue.put(packet)
                    self.stats['packets_received'] += 1
                
                time.sleep(2)  # Simulate packet interval
                
            except Exception as e:
                logger.error(f"❌ BLE listener error: {e}")
                time.sleep(5)
    
    def _wifi_listener(self):
        """WiFi listener thread - simulates listening for WiFi packets"""
        logger.info("📡 WiFi listener thread started")
        
        while self.running:
            try:
                # Simulate WiFi packet reception
                if self._simulate_wifi_packet():
                    packet = self._generate_simulated_packet('wifi')
                    self.wifi_queue.put(packet)
                    self.stats['packets_received'] += 1
                
                time.sleep(1)  # Simulate packet interval
                
            except Exception as e:
                logger.error(f"❌ WiFi listener error: {e}")
                time.sleep(5)
    
    def _data_processor(self):
        """Data processing thread - decrypts and validates packets"""
        logger.info("🧠 Data processor thread started")
        
        while self.running:
            try:
                # Process BLE packets
                try:
                    ble_packet = self.ble_queue.get_nowait()
                    self._process_packet(ble_packet)
                except queue.Empty:
                    pass
                
                # Process WiFi packets
                try:
                    wifi_packet = self.wifi_queue.get_nowait()
                    self._process_packet(wifi_packet)
                except queue.Empty:
                    pass
                
                time.sleep(0.1)  # Small delay to prevent busy waiting
                
            except Exception as e:
                logger.error(f"❌ Data processor error: {e}")
                time.sleep(1)
    
    def _process_packet(self, packet: Dict[str, Any]):
        """Process and decrypt a received packet"""
        try:
            device_id = packet.get('device_id')
            
            # Check if device is registered
            if device_id not in self.device_registry:
                logger.warning(f"⚠️ Unknown device: {device_id}")
                return
            
            device_info = self.device_registry[device_id]
            
            # Update device last seen
            device_info.last_seen = datetime.now()
            
            # Decrypt packet data
            if self.config.get('encryption_enabled', True):
                encrypted_data = packet.get('encrypted_data', b'')
                try:
                    decrypted_data = self.fernet.decrypt(encrypted_data)
                    packet_data = json.loads(decrypted_data.decode('utf-8'))
                except Exception as e:
                    logger.error(f"❌ Failed to decrypt packet from {device_id}: {e}")
                    return
            else:
                packet_data = packet.get('data', {})
            
            # Create emotion data object
            emotion_data = EmotionData(
                device_id=device_id,
                emotion=packet_data.get('emotion', 'unknown'),
                emotion_score=packet_data.get('emotion_score', 0.0),
                confidence=packet_data.get('confidence', 0.0),
                timestamp=datetime.fromtimestamp(packet_data.get('timestamp', time.time()) / 1000),
                raw_data=packet_data
            )
            
            # Add to cloud forwarding queue
            self.cloud_queue.put(emotion_data)
            
            logger.info(f"📊 Processed packet from {device_id}: {emotion_data.emotion} ({emotion_data.emotion_score:.2f})")
            
        except Exception as e:
            logger.error(f"❌ Packet processing error: {e}")
            self.stats['packets_failed'] += 1
    
    def _cloud_forwarder(self):
        """Cloud forwarding thread - sends data to NovaSanctum cloud"""
        logger.info("☁️ Cloud forwarder thread started")
        
        while self.running:
            try:
                # Get emotion data from queue
                try:
                    emotion_data = self.cloud_queue.get(timeout=1)
                except queue.Empty:
                    continue
                
                # Forward to cloud
                success = self._forward_to_cloud(emotion_data)
                
                if success:
                    self.stats['packets_forwarded'] += 1
                    logger.info(f"☁️ Forwarded data from {emotion_data.device_id} to cloud")
                else:
                    self.stats['packets_failed'] += 1
                    logger.error(f"❌ Failed to forward data from {emotion_data.device_id}")
                
            except Exception as e:
                logger.error(f"❌ Cloud forwarder error: {e}")
                time.sleep(5)
    
    def _forward_to_cloud(self, emotion_data: EmotionData) -> bool:
        """Forward emotion data to NovaSanctum cloud"""
        try:
            # Prepare payload
            payload = {
                'edge_node_id': self.config.get('node_id', 'edge_node_001'),
                'timestamp': datetime.now().isoformat(),
                'emotion_data': asdict(emotion_data)
            }
            
            # Send to cloud endpoint
            response = requests.post(
                self.config['cloud_endpoint'],
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"❌ Cloud forwarding error: {e}")
            return False
    
    def _heartbeat_monitor(self):
        """Heartbeat monitoring thread"""
        logger.info("💓 Heartbeat monitor thread started")
        
        while self.running:
            try:
                # Update statistics
                self.stats['last_heartbeat'] = datetime.now()
                self.stats['devices_active'] = len([
                    device for device in self.device_registry.values()
                    if (datetime.now() - device.last_seen).seconds < 300  # 5 minutes
                ])
                
                # Log heartbeat
                logger.info(f"💓 Heartbeat - Active devices: {self.stats['devices_active']}, "
                          f"Packets received: {self.stats['packets_received']}, "
                          f"Forwarded: {self.stats['packets_forwarded']}")
                
                # Save device registry
                self._save_device_registry()
                
                time.sleep(self.config.get('heartbeat_interval', 30))
                
            except Exception as e:
                logger.error(f"❌ Heartbeat monitor error: {e}")
                time.sleep(30)
    
    def _save_device_registry(self):
        """Save device registry to file"""
        try:
            registry_data = {}
            for device_id, device_info in self.device_registry.items():
                registry_data[device_id] = {
                    'public_key': device_info.public_key,
                    'last_seen': device_info.last_seen.isoformat(),
                    'status': device_info.status,
                    'location': device_info.location,
                    'capabilities': device_info.capabilities or []
                }
            
            with open('device_registry.json', 'w') as f:
                json.dump(registry_data, f, indent=2)
                
        except Exception as e:
            logger.error(f"❌ Failed to save device registry: {e}")
    
    def _save_stats(self):
        """Save final statistics"""
        try:
            stats_data = {
                'timestamp': datetime.now().isoformat(),
                'stats': self.stats
            }
            
            with open('edge_node_stats.json', 'w') as f:
                json.dump(stats_data, f, indent=2)
                
        except Exception as e:
            logger.error(f"❌ Failed to save statistics: {e}")
    
    def _simulate_ble_packet(self) -> bool:
        """Simulate BLE packet reception"""
        import random
        return random.random() < 0.3  # 30% chance of packet
    
    def _simulate_wifi_packet(self) -> bool:
        """Simulate WiFi packet reception"""
        import random
        return random.random() < 0.5  # 50% chance of packet
    
    def _generate_simulated_packet(self, protocol: str) -> Dict[str, Any]:
        """Generate a simulated packet for testing"""
        import random
        
        device_ids = list(self.device_registry.keys())
        if not device_ids:
            device_ids = ['nova_tiny_001', 'nova_tiny_002', 'nova_tiny_003']
        
        device_id = random.choice(device_ids)
        
        # Simulate emotion data
        emotions = ['calm', 'excited', 'stressed', 'focused', 'relaxed', 'anxious']
        emotion = random.choice(emotions)
        emotion_score = random.uniform(0.1, 0.9)
        confidence = random.uniform(0.7, 0.95)
        
        # Create packet data
        packet_data = {
            'device_id': device_id,
            'emotion': emotion,
            'emotion_score': emotion_score,
            'confidence': confidence,
            'timestamp': int(time.time() * 1000)
        }
        
        # Encrypt data
        if self.config.get('encryption_enabled', True):
            encrypted_data = self.fernet.encrypt(json.dumps(packet_data).encode('utf-8'))
        else:
            encrypted_data = b''
        
        return {
            'device_id': device_id,
            'protocol': protocol,
            'timestamp': datetime.now().isoformat(),
            'encrypted_data': encrypted_data,
            'data': packet_data if not self.config.get('encryption_enabled', True) else None
        }

def main():
    """Main entry point"""
    print("🥀 Nova Edge Node - Divine Digital Infrastructure")
    print("=" * 50)
    
    # Create and start edge node
    edge_node = NovaEdgeNode()
    
    try:
        edge_node.start()
        
        # Keep running until interrupted
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Received shutdown signal")
        edge_node.stop()
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
        edge_node.stop()
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main()) 