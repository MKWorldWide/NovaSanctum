/**
 * NovaComms.h - Communication Interface
 * 
 * BLE/Wi-Fi packet transmission for NovaTiny agents
 * Handles secure data transmission to NovaSanctum network
 * 
 * @author NovaSanctum System
 * @version 1.0.0
 * @license Divine Protocol
 */

#ifndef NOVA_COMMS_H
#define NOVA_COMMS_H

#include <string>
#include <vector>
#include <memory>
#include <chrono>

// Forward declarations
struct InferenceResult;
struct TransmissionPacket;

/**
 * Communication protocols supported by NovaComms
 */
enum class CommProtocol {
    BLE = 0,
    WIFI = 1,
    BOTH = 2
};

/**
 * Transmission status
 */
enum class TransmissionStatus {
    SUCCESS = 0,
    FAILED = 1,
    PENDING = 2,
    RETRY = 3
};

/**
 * Data packet structure for transmission
 */
struct TransmissionPacket {
    std::string deviceId;
    std::string packetId;
    std::chrono::system_clock::time_point timestamp;
    std::vector<uint8_t> encryptedData;
    CommProtocol protocol;
    int retryCount;
    TransmissionStatus status;
    
    TransmissionPacket() : retryCount(0), status(TransmissionStatus::PENDING) {}
};

/**
 * Communication statistics
 */
struct CommStats {
    int totalPacketsSent;
    int successfulTransmissions;
    int failedTransmissions;
    double averageLatency;
    std::chrono::system_clock::time_point lastTransmission;
    
    CommStats() : totalPacketsSent(0), successfulTransmissions(0), failedTransmissions(0), averageLatency(0.0) {}
};

/**
 * Encryption interface
 */
class DataEncryptor {
public:
    virtual ~DataEncryptor() = default;
    virtual std::vector<uint8_t> encrypt(const std::string& data) = 0;
    virtual std::string decrypt(const std::vector<uint8_t>& encryptedData) = 0;
    virtual bool isInitialized() const = 0;
};

/**
 * BLE communication interface
 */
class BLETransmitter {
private:
    std::string deviceName;
    std::string serviceUUID;
    bool isConnected;
    int signalStrength;
    
public:
    BLETransmitter(const std::string& name = "NovaTiny");
    ~BLETransmitter();
    
    bool initialize();
    bool connect();
    bool transmit(const std::vector<uint8_t>& data);
    void disconnect();
    
    bool isBLEConnected() const { return isConnected; }
    int getSignalStrength() const { return signalStrength; }
    std::string getDeviceName() const { return deviceName; }
};

/**
 * Wi-Fi communication interface
 */
class WiFiTransmitter {
private:
    std::string ssid;
    std::string password;
    std::string serverUrl;
    bool isConnected;
    int connectionQuality;
    
public:
    WiFiTransmitter(const std::string& networkSSID = "NovaSanctum");
    ~WiFiTransmitter();
    
    bool initialize();
    bool connect();
    bool transmit(const std::vector<uint8_t>& data);
    void disconnect();
    
    bool isWiFiConnected() const { return isConnected; }
    int getConnectionQuality() const { return connectionQuality; }
    std::string getSSID() const { return ssid; }
};

/**
 * Main communication manager
 */
class NovaComms {
private:
    std::unique_ptr<DataEncryptor> encryptor;
    std::unique_ptr<BLETransmitter> bleTransmitter;
    std::unique_ptr<WiFiTransmitter> wifiTransmitter;
    
    std::string deviceId;
    CommProtocol preferredProtocol;
    bool isInitialized;
    
    // Transmission queue and statistics
    std::vector<TransmissionPacket> transmissionQueue;
    CommStats stats;
    int maxRetries;
    
public:
    NovaComms(const std::string& deviceId = "nova_tiny_001");
    ~NovaComms();
    
    bool initialize(CommProtocol protocol = CommProtocol::BOTH);
    bool transmitData(const InferenceResult& inference);
    void processTransmissionQueue();
    void shutdown();
    
    // Configuration
    void setPreferredProtocol(CommProtocol protocol) { preferredProtocol = protocol; }
    void setMaxRetries(int retries) { maxRetries = retries; }
    
    // Status and statistics
    CommStats getStats() const { return stats; }
    bool isSystemInitialized() const { return isInitialized; }
    std::string getDeviceId() const { return deviceId; }
    CommProtocol getPreferredProtocol() const { return preferredProtocol; }
    
    // Queue management
    size_t getQueueSize() const { return transmissionQueue.size(); }
    void clearQueue();
    
private:
    TransmissionPacket createPacket(const InferenceResult& inference);
    bool attemptTransmission(const TransmissionPacket& packet);
    void updateStats(bool success, double latency);
    std::string generatePacketId();
};

#endif // NOVA_COMMS_H 