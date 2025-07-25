/**
 * NovaComms.cpp - Communication Implementation
 * 
 * BLE/Wi-Fi packet transmission implementation
 * Handles secure data transmission to NovaSanctum network
 * 
 * @author NovaSanctum System
 * @version 1.0.0
 * @license Divine Protocol
 */

#include "NovaComms.h"
#include "NovaML.h"
#include <iostream>
#include <random>
#include <sstream>
#include <iomanip>
#include <algorithm>

// Simple encryption implementation (AES-256 simulation)
class SimpleEncryptor : public DataEncryptor {
private:
    std::string encryptionKey;
    bool initialized;
    
public:
    SimpleEncryptor() : initialized(false) {
        // Generate a simple encryption key (in real implementation, use proper key management)
        encryptionKey = "NovaSanctum_Divine_Key_2024";
        initialized = true;
    }
    
    bool isInitialized() const override {
        return initialized;
    }
    
    std::vector<uint8_t> encrypt(const std::string& data) override {
        std::vector<uint8_t> encrypted;
        
        if (!initialized) {
            std::cerr << "[SimpleEncryptor] ❌ Encryptor not initialized" << std::endl;
            return encrypted;
        }
        
        // Simple XOR encryption (in real implementation, use AES-256)
        encrypted.reserve(data.size());
        for (size_t i = 0; i < data.size(); ++i) {
            uint8_t encryptedByte = data[i] ^ encryptionKey[i % encryptionKey.size()];
            encrypted.push_back(encryptedByte);
        }
        
        std::cout << "[SimpleEncryptor] 🔐 Encrypted " << data.size() << " bytes" << std::endl;
        return encrypted;
    }
    
    std::string decrypt(const std::vector<uint8_t>& encryptedData) override {
        std::string decrypted;
        
        if (!initialized) {
            std::cerr << "[SimpleEncryptor] ❌ Encryptor not initialized" << std::endl;
            return decrypted;
        }
        
        // Simple XOR decryption
        decrypted.reserve(encryptedData.size());
        for (size_t i = 0; i < encryptedData.size(); ++i) {
            char decryptedChar = encryptedData[i] ^ encryptionKey[i % encryptionKey.size()];
            decrypted.push_back(decryptedChar);
        }
        
        std::cout << "[SimpleEncryptor] 🔓 Decrypted " << encryptedData.size() << " bytes" << std::endl;
        return decrypted;
    }
};

// BLETransmitter Implementation
BLETransmitter::BLETransmitter(const std::string& name) 
    : deviceName(name), serviceUUID("12345678-1234-1234-1234-123456789abc"), isConnected(false), signalStrength(0) {}

BLETransmitter::~BLETransmitter() {
    disconnect();
}

bool BLETransmitter::initialize() {
    std::cout << "[BLETransmitter] 📡 Initializing BLE transmitter: " << deviceName << std::endl;
    
    // Simulate BLE initialization
    std::cout << "[BLETransmitter] ✅ BLE transmitter initialized" << std::endl;
    return true;
}

bool BLETransmitter::connect() {
    if (isConnected) {
        std::cout << "[BLETransmitter] ℹ️ Already connected" << std::endl;
        return true;
    }
    
    std::cout << "[BLETransmitter] 🔗 Attempting BLE connection..." << std::endl;
    
    // Simulate connection process
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> signalDis(30, 90);
    
    signalStrength = signalDis(gen);
    isConnected = (signalStrength > 50); // Simulate connection success based on signal strength
    
    if (isConnected) {
        std::cout << "[BLETransmitter] ✅ BLE connected (Signal: " << signalStrength << "%)" << std::endl;
    } else {
        std::cout << "[BLETransmitter] ❌ BLE connection failed (Signal: " << signalStrength << "%)" << std::endl;
    }
    
    return isConnected;
}

bool BLETransmitter::transmit(const std::vector<uint8_t>& data) {
    if (!isConnected) {
        std::cerr << "[BLETransmitter] ❌ Cannot transmit - not connected" << std::endl;
        return false;
    }
    
    // Simulate BLE transmission
    std::cout << "[BLETransmitter] 📤 Transmitting " << data.size() << " bytes via BLE" << std::endl;
    
    // Simulate transmission success based on signal strength
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<> successDis(0.0, 1.0);
    
    bool success = successDis(gen) < (signalStrength / 100.0);
    
    if (success) {
        std::cout << "[BLETransmitter] ✅ BLE transmission successful" << std::endl;
    } else {
        std::cout << "[BLETransmitter] ❌ BLE transmission failed" << std::endl;
    }
    
    return success;
}

void BLETransmitter::disconnect() {
    if (isConnected) {
        std::cout << "[BLETransmitter] 🔌 Disconnecting BLE" << std::endl;
        isConnected = false;
        signalStrength = 0;
    }
}

// WiFiTransmitter Implementation
WiFiTransmitter::WiFiTransmitter(const std::string& networkSSID) 
    : ssid(networkSSID), password("NovaSanctum2024"), serverUrl("https://api.novasanctum.com/stream"), 
      isConnected(false), connectionQuality(0) {}

WiFiTransmitter::~WiFiTransmitter() {
    disconnect();
}

bool WiFiTransmitter::initialize() {
    std::cout << "[WiFiTransmitter] 📡 Initializing WiFi transmitter: " << ssid << std::endl;
    
    // Simulate WiFi initialization
    std::cout << "[WiFiTransmitter] ✅ WiFi transmitter initialized" << std::endl;
    return true;
}

bool WiFiTransmitter::connect() {
    if (isConnected) {
        std::cout << "[WiFiTransmitter] ℹ️ Already connected" << std::endl;
        return true;
    }
    
    std::cout << "[WiFiTransmitter] 🔗 Attempting WiFi connection to: " << ssid << std::endl;
    
    // Simulate connection process
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> qualityDis(60, 95);
    
    connectionQuality = qualityDis(gen);
    isConnected = (connectionQuality > 70); // Simulate connection success based on quality
    
    if (isConnected) {
        std::cout << "[WiFiTransmitter] ✅ WiFi connected (Quality: " << connectionQuality << "%)" << std::endl;
    } else {
        std::cout << "[WiFiTransmitter] ❌ WiFi connection failed (Quality: " << connectionQuality << "%)" << std::endl;
    }
    
    return isConnected;
}

bool WiFiTransmitter::transmit(const std::vector<uint8_t>& data) {
    if (!isConnected) {
        std::cerr << "[WiFiTransmitter] ❌ Cannot transmit - not connected" << std::endl;
        return false;
    }
    
    // Simulate WiFi transmission
    std::cout << "[WiFiTransmitter] 📤 Transmitting " << data.size() << " bytes via WiFi to: " << serverUrl << std::endl;
    
    // Simulate transmission success based on connection quality
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<> successDis(0.0, 1.0);
    
    bool success = successDis(gen) < (connectionQuality / 100.0);
    
    if (success) {
        std::cout << "[WiFiTransmitter] ✅ WiFi transmission successful" << std::endl;
    } else {
        std::cout << "[WiFiTransmitter] ❌ WiFi transmission failed" << std::endl;
    }
    
    return success;
}

void WiFiTransmitter::disconnect() {
    if (isConnected) {
        std::cout << "[WiFiTransmitter] 🔌 Disconnecting WiFi" << std::endl;
        isConnected = false;
        connectionQuality = 0;
    }
}

// NovaComms Implementation
NovaComms::NovaComms(const std::string& deviceId) 
    : deviceId(deviceId), preferredProtocol(CommProtocol::BOTH), isInitialized(false), maxRetries(3) {
    
    encryptor = std::make_unique<SimpleEncryptor>();
    bleTransmitter = std::make_unique<BLETransmitter>("NovaTiny_" + deviceId);
    wifiTransmitter = std::make_unique<WiFiTransmitter>("NovaSanctum");
}

NovaComms::~NovaComms() {
    shutdown();
}

bool NovaComms::initialize(CommProtocol protocol) {
    std::cout << "[NovaComms] 🥀 Initializing Nova communication system for device: " << deviceId << std::endl;
    
    preferredProtocol = protocol;
    
    // Initialize encryption
    if (!encryptor->isInitialized()) {
        std::cerr << "[NovaComms] ❌ Failed to initialize encryption" << std::endl;
        return false;
    }
    
    // Initialize transmitters based on protocol preference
    bool transmittersInitialized = true;
    
    if (protocol == CommProtocol::BLE || protocol == CommProtocol::BOTH) {
        if (!bleTransmitter->initialize()) {
            std::cerr << "[NovaComms] ❌ Failed to initialize BLE transmitter" << std::endl;
            transmittersInitialized = false;
        }
    }
    
    if (protocol == CommProtocol::WIFI || protocol == CommProtocol::BOTH) {
        if (!wifiTransmitter->initialize()) {
            std::cerr << "[NovaComms] ❌ Failed to initialize WiFi transmitter" << std::endl;
            transmittersInitialized = false;
        }
    }
    
    isInitialized = transmittersInitialized;
    
    if (isInitialized) {
        std::cout << "[NovaComms] ✅ Communication system initialized successfully" << std::endl;
    } else {
        std::cout << "[NovaComms] ⚠️ Some transmitters failed to initialize" << std::endl;
    }
    
    return isInitialized;
}

bool NovaComms::transmitData(const InferenceResult& inference) {
    if (!isInitialized) {
        std::cerr << "[NovaComms] ❌ Cannot transmit - communication system not initialized" << std::endl;
        return false;
    }
    
    // Create transmission packet
    auto packet = createPacket(inference);
    
    // Attempt transmission
    bool success = attemptTransmission(packet);
    
    if (success) {
        // Update statistics
        auto now = std::chrono::system_clock::now();
        auto latency = std::chrono::duration_cast<std::chrono::milliseconds>(now - packet.timestamp).count();
        updateStats(true, latency);
        
        std::cout << "[NovaComms] ✅ Data transmitted successfully (Latency: " << latency << "ms)" << std::endl;
    } else {
        // Add to retry queue
        transmissionQueue.push_back(packet);
        updateStats(false, 0.0);
        
        std::cout << "[NovaComms] ⚠️ Transmission failed, added to retry queue" << std::endl;
    }
    
    return success;
}

void NovaComms::processTransmissionQueue() {
    if (transmissionQueue.empty()) {
        return;
    }
    
    std::cout << "[NovaComms] 🔄 Processing transmission queue (" << transmissionQueue.size() << " packets)" << std::endl;
    
    auto it = transmissionQueue.begin();
    while (it != transmissionQueue.end()) {
        if (it->retryCount >= maxRetries) {
            std::cout << "[NovaComms] ❌ Packet " << it->packetId << " exceeded max retries" << std::endl;
            it = transmissionQueue.erase(it);
            continue;
        }
        
        it->retryCount++;
        bool success = attemptTransmission(*it);
        
        if (success) {
            auto now = std::chrono::system_clock::now();
            auto latency = std::chrono::duration_cast<std::chrono::milliseconds>(now - it->timestamp).count();
            updateStats(true, latency);
            
            std::cout << "[NovaComms] ✅ Retry successful for packet " << it->packetId << std::endl;
            it = transmissionQueue.erase(it);
        } else {
            std::cout << "[NovaComms] ⚠️ Retry failed for packet " << it->packetId << " (Attempt " << it->retryCount << "/" << maxRetries << ")" << std::endl;
            ++it;
        }
    }
}

void NovaComms::shutdown() {
    std::cout << "[NovaComms] 🛑 Shutting down Nova communication system" << std::endl;
    
    if (bleTransmitter) bleTransmitter->disconnect();
    if (wifiTransmitter) wifiTransmitter->disconnect();
    
    clearQueue();
    isInitialized = false;
}

void NovaComms::clearQueue() {
    std::cout << "[NovaComms] 🗑️ Clearing transmission queue (" << transmissionQueue.size() << " packets)" << std::endl;
    transmissionQueue.clear();
}

TransmissionPacket NovaComms::createPacket(const InferenceResult& inference) {
    TransmissionPacket packet;
    packet.deviceId = deviceId;
    packet.packetId = generatePacketId();
    packet.timestamp = std::chrono::system_clock::now();
    packet.protocol = preferredProtocol;
    
    // Create JSON-like data string
    std::stringstream dataStream;
    dataStream << "{";
    dataStream << "\"device_id\":\"" << inference.deviceId << "\",";
    dataStream << "\"emotion\":\"" << inference.getEmotionString() << "\",";
    dataStream << "\"emotion_score\":" << inference.emotionScore << ",";
    dataStream << "\"confidence\":" << inference.confidence << ",";
    dataStream << "\"timestamp\":\"" << std::chrono::duration_cast<std::chrono::milliseconds>(inference.timestamp.time_since_epoch()).count() << "\"";
    dataStream << "}";
    
    std::string dataString = dataStream.str();
    
    // Encrypt the data
    packet.encryptedData = encryptor->encrypt(dataString);
    
    return packet;
}

bool NovaComms::attemptTransmission(const TransmissionPacket& packet) {
    bool success = false;
    
    // Try preferred protocol first
    if (packet.protocol == CommProtocol::BLE || packet.protocol == CommProtocol::BOTH) {
        if (bleTransmitter->isBLEConnected() || bleTransmitter->connect()) {
            success = bleTransmitter->transmit(packet.encryptedData);
            if (success) return true;
        }
    }
    
    if (packet.protocol == CommProtocol::WIFI || packet.protocol == CommProtocol::BOTH) {
        if (wifiTransmitter->isWiFiConnected() || wifiTransmitter->connect()) {
            success = wifiTransmitter->transmit(packet.encryptedData);
            if (success) return true;
        }
    }
    
    return false;
}

void NovaComms::updateStats(bool success, double latency) {
    stats.totalPacketsSent++;
    
    if (success) {
        stats.successfulTransmissions++;
        stats.averageLatency = (stats.averageLatency * (stats.successfulTransmissions - 1) + latency) / stats.successfulTransmissions;
    } else {
        stats.failedTransmissions++;
    }
    
    stats.lastTransmission = std::chrono::system_clock::now();
}

std::string NovaComms::generatePacketId() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(100000, 999999);
    
    std::stringstream ss;
    ss << deviceId << "_" << dis(gen);
    return ss.str();
} 