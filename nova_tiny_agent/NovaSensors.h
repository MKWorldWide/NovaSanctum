/**
 * NovaSensors.h - Abstract Sensor Interface
 * 
 * Divine sensor abstraction layer for NovaTiny agents
 * Supports: microphone, motion, heart rate, temperature
 * 
 * @author NovaSanctum System
 * @version 1.0.0
 * @license Divine Protocol
 */

#ifndef NOVA_SENSORS_H
#define NOVA_SENSORS_H

#include <vector>
#include <string>
#include <chrono>
#include <memory>

// Forward declarations
struct SensorDataPoint;
struct SensorData;

/**
 * Abstract base class for all Nova sensors
 */
class NovaSensor {
protected:
    std::string sensorId;
    bool isActive;
    std::chrono::system_clock::time_point lastReading;
    
public:
    NovaSensor(const std::string& id) : sensorId(id), isActive(false) {}
    virtual ~NovaSensor() = default;
    
    virtual bool initialize() = 0;
    virtual bool readData(SensorDataPoint& dataPoint) = 0;
    virtual void shutdown() = 0;
    
    bool isSensorActive() const { return isActive; }
    std::string getSensorId() const { return sensorId; }
    std::chrono::system_clock::time_point getLastReading() const { return lastReading; }
};

/**
 * Data structure for individual sensor readings
 */
struct SensorDataPoint {
    std::string sensorType;
    std::string sensorId;
    double value;
    std::string unit;
    std::chrono::system_clock::time_point timestamp;
    double confidence; // 0.0 to 1.0
    
    SensorDataPoint() : value(0.0), confidence(0.0) {}
};

/**
 * Container for all sensor data from a collection cycle
 */
struct SensorData {
    std::vector<SensorDataPoint> dataPoints;
    std::chrono::system_clock::time_point collectionTime;
    std::string deviceId;
    
    SensorData() : collectionTime(std::chrono::system_clock::now()) {}
    
    bool isValid() const { return !dataPoints.empty(); }
    size_t getDataPoints() const { return dataPoints.size(); }
    
    void addDataPoint(const SensorDataPoint& point) {
        dataPoints.push_back(point);
    }
};

/**
 * Microphone sensor implementation
 */
class NovaMicrophone : public NovaSensor {
private:
    double sampleRate;
    double volumeThreshold;
    
public:
    NovaMicrophone(const std::string& id = "mic_001");
    bool initialize() override;
    bool readData(SensorDataPoint& dataPoint) override;
    void shutdown() override;
    
    void setVolumeThreshold(double threshold) { volumeThreshold = threshold; }
    double getVolumeThreshold() const { return volumeThreshold; }
};

/**
 * Motion sensor implementation
 */
class NovaMotion : public NovaSensor {
private:
    double sensitivity;
    bool motionDetected;
    
public:
    NovaMotion(const std::string& id = "motion_001");
    bool initialize() override;
    bool readData(SensorDataPoint& dataPoint) override;
    void shutdown() override;
    
    void setSensitivity(double sens) { sensitivity = sens; }
    double getSensitivity() const { return sensitivity; }
    bool hasMotion() const { return motionDetected; }
};

/**
 * Heart rate sensor implementation
 */
class NovaHeartRate : public NovaSensor {
private:
    int bpm;
    double accuracy;
    
public:
    NovaHeartRate(const std::string& id = "heart_001");
    bool initialize() override;
    bool readData(SensorDataPoint& dataPoint) override;
    void shutdown() override;
    
    int getBPM() const { return bpm; }
    double getAccuracy() const { return accuracy; }
};

/**
 * Temperature sensor implementation
 */
class NovaTemperature : public NovaSensor {
private:
    double temperature;
    std::string scale; // "C" or "F"
    
public:
    NovaTemperature(const std::string& id = "temp_001");
    bool initialize() override;
    bool readData(SensorDataPoint& dataPoint) override;
    void shutdown() override;
    
    double getTemperature() const { return temperature; }
    std::string getScale() const { return scale; }
    void setScale(const std::string& tempScale) { scale = tempScale; }
};

/**
 * Main sensor manager class
 */
class NovaSensors {
private:
    std::unique_ptr<NovaMicrophone> microphone;
    std::unique_ptr<NovaMotion> motion;
    std::unique_ptr<NovaHeartRate> heartRate;
    std::unique_ptr<NovaTemperature> temperature;
    
    std::string deviceId;
    bool isInitialized;
    
public:
    NovaSensors(const std::string& deviceId = "nova_tiny_001");
    ~NovaSensors();
    
    bool initialize();
    SensorData collectAllData();
    void shutdown();
    
    // Individual sensor access
    NovaMicrophone* getMicrophone() { return microphone.get(); }
    NovaMotion* getMotion() { return motion.get(); }
    NovaHeartRate* getHeartRate() { return heartRate.get(); }
    NovaTemperature* getTemperature() { return temperature.get(); }
    
    bool isSystemInitialized() const { return isInitialized; }
    std::string getDeviceId() const { return deviceId; }
};

#endif // NOVA_SENSORS_H 