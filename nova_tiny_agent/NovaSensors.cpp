/**
 * NovaSensors.cpp - Sensor Implementation
 * 
 * Concrete implementations of Nova sensor abstractions
 * Provides real-time data collection for divine AI processing
 * 
 * @author NovaSanctum System
 * @version 1.0.0
 * @license Divine Protocol
 */

#include "NovaSensors.h"
#include <iostream>
#include <random>
#include <cmath>

// NovaMicrophone Implementation
NovaMicrophone::NovaMicrophone(const std::string& id) 
    : NovaSensor(id), sampleRate(44100.0), volumeThreshold(0.1) {}

bool NovaMicrophone::initialize() {
    // Simulate microphone initialization
    std::cout << "[NovaMicrophone] 🎤 Initializing microphone sensor: " << sensorId << std::endl;
    isActive = true;
    lastReading = std::chrono::system_clock::now();
    return true;
}

bool NovaMicrophone::readData(SensorDataPoint& dataPoint) {
    if (!isActive) return false;
    
    // Simulate audio level reading (0.0 to 1.0)
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<> dis(0.0, 1.0);
    
    dataPoint.sensorType = "microphone";
    dataPoint.sensorId = sensorId;
    dataPoint.value = dis(gen);
    dataPoint.unit = "amplitude";
    dataPoint.timestamp = std::chrono::system_clock::now();
    dataPoint.confidence = 0.95;
    
    lastReading = dataPoint.timestamp;
    return true;
}

void NovaMicrophone::shutdown() {
    std::cout << "[NovaMicrophone] 🎤 Shutting down microphone sensor: " << sensorId << std::endl;
    isActive = false;
}

// NovaMotion Implementation
NovaMotion::NovaMotion(const std::string& id) 
    : NovaSensor(id), sensitivity(0.5), motionDetected(false) {}

bool NovaMotion::initialize() {
    std::cout << "[NovaMotion] 🏃 Initializing motion sensor: " << sensorId << std::endl;
    isActive = true;
    lastReading = std::chrono::system_clock::now();
    return true;
}

bool NovaMotion::readData(SensorDataPoint& dataPoint) {
    if (!isActive) return false;
    
    // Simulate motion detection (0 = no motion, 1 = motion detected)
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<> dis(0.0, 1.0);
    
    double motionValue = dis(gen);
    motionDetected = motionValue > sensitivity;
    
    dataPoint.sensorType = "motion";
    dataPoint.sensorId = sensorId;
    dataPoint.value = motionDetected ? 1.0 : 0.0;
    dataPoint.unit = "detection";
    dataPoint.timestamp = std::chrono::system_clock::now();
    dataPoint.confidence = motionDetected ? 0.9 : 0.95;
    
    lastReading = dataPoint.timestamp;
    return true;
}

void NovaMotion::shutdown() {
    std::cout << "[NovaMotion] 🏃 Shutting down motion sensor: " << sensorId << std::endl;
    isActive = false;
}

// NovaHeartRate Implementation
NovaHeartRate::NovaHeartRate(const std::string& id) 
    : NovaSensor(id), bpm(72), accuracy(0.85) {}

bool NovaHeartRate::initialize() {
    std::cout << "[NovaHeartRate] ❤️ Initializing heart rate sensor: " << sensorId << std::endl;
    isActive = true;
    lastReading = std::chrono::system_clock::now();
    return true;
}

bool NovaHeartRate::readData(SensorDataPoint& dataPoint) {
    if (!isActive) return false;
    
    // Simulate heart rate reading (60-100 BPM range)
    std::random_device rd;
    std::mt19937 gen(rd());
    std::normal_distribution<> dis(72.0, 8.0); // Mean 72, std dev 8
    
    bpm = std::max(60, std::min(100, static_cast<int>(dis(gen))));
    
    dataPoint.sensorType = "heart_rate";
    dataPoint.sensorId = sensorId;
    dataPoint.value = static_cast<double>(bpm);
    dataPoint.unit = "bpm";
    dataPoint.timestamp = std::chrono::system_clock::now();
    dataPoint.confidence = accuracy;
    
    lastReading = dataPoint.timestamp;
    return true;
}

void NovaHeartRate::shutdown() {
    std::cout << "[NovaHeartRate] ❤️ Shutting down heart rate sensor: " << sensorId << std::endl;
    isActive = false;
}

// NovaTemperature Implementation
NovaTemperature::NovaTemperature(const std::string& id) 
    : NovaSensor(id), temperature(22.0), scale("C") {}

bool NovaTemperature::initialize() {
    std::cout << "[NovaTemperature] 🌡️ Initializing temperature sensor: " << sensorId << std::endl;
    isActive = true;
    lastReading = std::chrono::system_clock::now();
    return true;
}

bool NovaTemperature::readData(SensorDataPoint& dataPoint) {
    if (!isActive) return false;
    
    // Simulate temperature reading (18-26°C range)
    std::random_device rd;
    std::mt19937 gen(rd());
    std::normal_distribution<> dis(22.0, 2.0); // Mean 22°C, std dev 2°C
    
    temperature = std::max(18.0, std::min(26.0, dis(gen)));
    
    dataPoint.sensorType = "temperature";
    dataPoint.sensorId = sensorId;
    dataPoint.value = temperature;
    dataPoint.unit = scale;
    dataPoint.timestamp = std::chrono::system_clock::now();
    dataPoint.confidence = 0.98;
    
    lastReading = dataPoint.timestamp;
    return true;
}

void NovaTemperature::shutdown() {
    std::cout << "[NovaTemperature] 🌡️ Shutting down temperature sensor: " << sensorId << std::endl;
    isActive = false;
}

// NovaSensors Implementation
NovaSensors::NovaSensors(const std::string& deviceId) 
    : deviceId(deviceId), isInitialized(false) {
    
    microphone = std::make_unique<NovaMicrophone>("mic_" + deviceId);
    motion = std::make_unique<NovaMotion>("motion_" + deviceId);
    heartRate = std::make_unique<NovaHeartRate>("heart_" + deviceId);
    temperature = std::make_unique<NovaTemperature>("temp_" + deviceId);
}

NovaSensors::~NovaSensors() {
    shutdown();
}

bool NovaSensors::initialize() {
    std::cout << "[NovaSensors] 🥀 Initializing Nova sensor array for device: " << deviceId << std::endl;
    
    bool allSensorsInitialized = true;
    
    // Initialize all sensors
    if (!microphone->initialize()) {
        std::cerr << "[NovaSensors] ❌ Failed to initialize microphone" << std::endl;
        allSensorsInitialized = false;
    }
    
    if (!motion->initialize()) {
        std::cerr << "[NovaSensors] ❌ Failed to initialize motion sensor" << std::endl;
        allSensorsInitialized = false;
    }
    
    if (!heartRate->initialize()) {
        std::cerr << "[NovaSensors] ❌ Failed to initialize heart rate sensor" << std::endl;
        allSensorsInitialized = false;
    }
    
    if (!temperature->initialize()) {
        std::cerr << "[NovaSensors] ❌ Failed to initialize temperature sensor" << std::endl;
        allSensorsInitialized = false;
    }
    
    isInitialized = allSensorsInitialized;
    
    if (isInitialized) {
        std::cout << "[NovaSensors] ✅ All sensors initialized successfully" << std::endl;
    } else {
        std::cout << "[NovaSensors] ⚠️ Some sensors failed to initialize" << std::endl;
    }
    
    return isInitialized;
}

SensorData NovaSensors::collectAllData() {
    SensorData data;
    data.deviceId = deviceId;
    
    if (!isInitialized) {
        std::cerr << "[NovaSensors] ❌ Cannot collect data - sensors not initialized" << std::endl;
        return data;
    }
    
    // Collect data from all active sensors
    SensorDataPoint dataPoint;
    
    if (microphone->isSensorActive() && microphone->readData(dataPoint)) {
        data.addDataPoint(dataPoint);
    }
    
    if (motion->isSensorActive() && motion->readData(dataPoint)) {
        data.addDataPoint(dataPoint);
    }
    
    if (heartRate->isSensorActive() && heartRate->readData(dataPoint)) {
        data.addDataPoint(dataPoint);
    }
    
    if (temperature->isSensorActive() && temperature->readData(dataPoint)) {
        data.addDataPoint(dataPoint);
    }
    
    std::cout << "[NovaSensors] 📊 Collected " << data.getDataPoints() << " sensor readings" << std::endl;
    return data;
}

void NovaSensors::shutdown() {
    std::cout << "[NovaSensors] 🛑 Shutting down Nova sensor array" << std::endl;
    
    if (microphone) microphone->shutdown();
    if (motion) motion->shutdown();
    if (heartRate) heartRate->shutdown();
    if (temperature) temperature->shutdown();
    
    isInitialized = false;
} 