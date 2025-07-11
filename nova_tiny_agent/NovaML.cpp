/**
 * NovaML.cpp - Machine Learning Implementation
 * 
 * Quantized model inference engine for emotion classification
 * Processes sensor data through divine AI algorithms
 * 
 * @author NovaSanctum System
 * @version 1.0.0
 * @license Divine Protocol
 */

#include "NovaML.h"
#include "NovaSensors.h"
#include <iostream>
#include <random>
#include <algorithm>
#include <cmath>

// Feature Extractor Implementation
class NovaFeatureExtractor : public FeatureExtractor {
private:
    bool initialized;
    
public:
    NovaFeatureExtractor() : initialized(false) {}
    
    bool isInitialized() const override {
        return initialized;
    }
    
    std::vector<double> extractFeatures(const SensorData& data) override {
        std::vector<double> features;
        
        if (data.dataPoints.empty()) {
            return features;
        }
        
        // Extract statistical features from sensor data
        std::vector<double> audioLevels, motionValues, heartRates, temperatures;
        
        for (const auto& point : data.dataPoints) {
            if (point.sensorType == "microphone") {
                audioLevels.push_back(point.value);
            } else if (point.sensorType == "motion") {
                motionValues.push_back(point.value);
            } else if (point.sensorType == "heart_rate") {
                heartRates.push_back(point.value);
            } else if (point.sensorType == "temperature") {
                temperatures.push_back(point.value);
            }
        }
        
        // Calculate statistical features
        if (!audioLevels.empty()) {
            features.push_back(calculateMean(audioLevels));
            features.push_back(calculateStdDev(audioLevels));
            features.push_back(calculateMax(audioLevels));
        } else {
            features.insert(features.end(), 3, 0.0);
        }
        
        if (!motionValues.empty()) {
            features.push_back(calculateMean(motionValues));
            features.push_back(calculateStdDev(motionValues));
        } else {
            features.insert(features.end(), 2, 0.0);
        }
        
        if (!heartRates.empty()) {
            features.push_back(calculateMean(heartRates));
            features.push_back(calculateStdDev(heartRates));
            features.push_back(calculateMin(heartRates));
            features.push_back(calculateMax(heartRates));
        } else {
            features.insert(features.end(), 4, 72.0); // Default heart rate
        }
        
        if (!temperatures.empty()) {
            features.push_back(calculateMean(temperatures));
            features.push_back(calculateStdDev(temperatures));
        } else {
            features.insert(features.end(), 2, 22.0); // Default temperature
        }
        
        // Normalize features to 0-1 range
        normalizeFeatures(features);
        
        initialized = true;
        return features;
    }
    
private:
    double calculateMean(const std::vector<double>& values) {
        if (values.empty()) return 0.0;
        double sum = 0.0;
        for (double value : values) sum += value;
        return sum / values.size();
    }
    
    double calculateStdDev(const std::vector<double>& values) {
        if (values.size() < 2) return 0.0;
        double mean = calculateMean(values);
        double sumSq = 0.0;
        for (double value : values) {
            sumSq += (value - mean) * (value - mean);
        }
        return std::sqrt(sumSq / (values.size() - 1));
    }
    
    double calculateMin(const std::vector<double>& values) {
        if (values.empty()) return 0.0;
        return *std::min_element(values.begin(), values.end());
    }
    
    double calculateMax(const std::vector<double>& values) {
        if (values.empty()) return 0.0;
        return *std::max_element(values.begin(), values.end());
    }
    
    void normalizeFeatures(std::vector<double>& features) {
        for (double& feature : features) {
            feature = std::max(0.0, std::min(1.0, feature));
        }
    }
};

// QuantizedModel Implementation
QuantizedModel::QuantizedModel(const std::string& path) 
    : InferenceModel(path), inputSize(11), outputSize(6) {
    
    // Initialize with random weights for demonstration
    std::random_device rd;
    std::mt19937 gen(rd());
    std::normal_distribution<> dis(0.0, 0.1);
    
    weights.resize(outputSize);
    for (auto& weight : weights) {
        weight.resize(inputSize);
        for (double& w : weight) {
            w = dis(gen);
        }
    }
    
    biases.resize(outputSize);
    for (double& bias : biases) {
        bias = dis(gen);
    }
}

QuantizedModel::~QuantizedModel() {
    unloadModel();
}

bool QuantizedModel::loadModel() {
    std::cout << "[QuantizedModel] 🧠 Loading emotion classification model: " << modelPath << std::endl;
    
    // In a real implementation, this would load from a quantized model file
    // For now, we'll simulate successful loading
    isLoaded = true;
    
    std::cout << "[QuantizedModel] ✅ Model loaded successfully" << std::endl;
    return true;
}

InferenceResult QuantizedModel::predict(const std::vector<double>& features) {
    InferenceResult result;
    
    if (!isLoaded || features.size() != inputSize) {
        std::cerr << "[QuantizedModel] ❌ Model not loaded or invalid input size" << std::endl;
        return result;
    }
    
    // Quantize input features
    auto quantizedFeatures = quantizeFeatures(features);
    
    // Forward pass through the model
    std::vector<double> logits(outputSize);
    for (int i = 0; i < outputSize; ++i) {
        logits[i] = biases[i];
        for (int j = 0; j < inputSize; ++j) {
            logits[i] += weights[i][j] * quantizedFeatures[j];
        }
    }
    
    // Apply softmax to get probabilities
    std::vector<double> probabilities(outputSize);
    double maxLogit = *std::max_element(logits.begin(), logits.end());
    double sumExp = 0.0;
    
    for (int i = 0; i < outputSize; ++i) {
        probabilities[i] = std::exp(logits[i] - maxLogit);
        sumExp += probabilities[i];
    }
    
    for (int i = 0; i < outputSize; ++i) {
        probabilities[i] /= sumExp;
    }
    
    // Classify emotion
    result.emotion = classifyEmotion(probabilities);
    result.emotionScore = probabilities[static_cast<int>(result.emotion)];
    result.confidence = result.emotionScore;
    result.timestamp = std::chrono::system_clock::now();
    result.featureVector = features;
    
    return result;
}

void QuantizedModel::unloadModel() {
    if (isLoaded) {
        std::cout << "[QuantizedModel] 🧠 Unloading model" << std::endl;
        isLoaded = false;
    }
}

std::vector<double> QuantizedModel::quantizeFeatures(const std::vector<double>& features) {
    std::vector<double> quantized = features;
    
    // Simple quantization: round to 2 decimal places
    for (double& feature : quantized) {
        feature = std::round(feature * 100.0) / 100.0;
    }
    
    return quantized;
}

EmotionCategory QuantizedModel::classifyEmotion(const std::vector<double>& probabilities) {
    auto maxIt = std::max_element(probabilities.begin(), probabilities.end());
    int maxIndex = std::distance(probabilities.begin(), maxIt);
    
    if (maxIndex >= 0 && maxIndex < 6) {
        return static_cast<EmotionCategory>(maxIndex);
    }
    
    return EmotionCategory::UNKNOWN;
}

// NovaML Implementation
NovaML::NovaML(const std::string& deviceId) 
    : deviceId(deviceId), isInitialized(false), averageInferenceTime(0.0), totalInferences(0) {
    
    featureExtractor = std::make_unique<NovaFeatureExtractor>();
}

NovaML::~NovaML() {
    shutdown();
}

bool NovaML::initialize(const std::string& modelPath) {
    std::cout << "[NovaML] 🥀 Initializing Nova ML engine for device: " << deviceId << std::endl;
    
    // Initialize feature extractor
    if (!featureExtractor->isInitialized()) {
        std::cout << "[NovaML] 🔧 Initializing feature extractor" << std::endl;
    }
    
    // Initialize and load model
    model = std::make_unique<QuantizedModel>(modelPath);
    if (!model->loadModel()) {
        std::cerr << "[NovaML] ❌ Failed to load model" << std::endl;
        return false;
    }
    
    isInitialized = true;
    std::cout << "[NovaML] ✅ ML engine initialized successfully" << std::endl;
    return true;
}

InferenceResult NovaML::processData(const SensorData& sensorData) {
    InferenceResult result;
    
    if (!isInitialized) {
        std::cerr << "[NovaML] ❌ Cannot process data - ML engine not initialized" << std::endl;
        return result;
    }
    
    auto startTime = std::chrono::high_resolution_clock::now();
    
    try {
        // Extract features from sensor data
        auto features = featureExtractor->extractFeatures(sensorData);
        
        if (features.empty()) {
            std::cerr << "[NovaML] ❌ No features extracted from sensor data" << std::endl;
            return result;
        }
        
        // Perform inference
        result = model->predict(features);
        result.deviceId = deviceId;
        
        // Update performance metrics
        auto endTime = std::chrono::high_resolution_clock::now();
        auto inferenceTime = std::chrono::duration_cast<std::chrono::microseconds>(endTime - startTime);
        updatePerformanceMetrics(inferenceTime.count() / 1000.0); // Convert to milliseconds
        
        lastInference = std::chrono::system_clock::now();
        
        if (result.isValid()) {
            std::cout << "[NovaML] 🧠 Inference complete - Emotion: " << result.getEmotionString() 
                      << " (Score: " << result.emotionScore << ", Confidence: " << result.confidence << ")" << std::endl;
        } else {
            std::cout << "[NovaML] ⚠️ Inference completed but result is invalid" << std::endl;
        }
        
    } catch (const std::exception& e) {
        std::cerr << "[NovaML] ❌ Error during inference: " << e.what() << std::endl;
    }
    
    return result;
}

void NovaML::shutdown() {
    std::cout << "[NovaML] 🛑 Shutting down Nova ML engine" << std::endl;
    
    if (model) {
        model->unloadModel();
    }
    
    isInitialized = false;
}

void NovaML::updatePerformanceMetrics(double inferenceTime) {
    totalInferences++;
    averageInferenceTime += inferenceTime;
    
    if (totalInferences % 10 == 0) {
        double avgTime = averageInferenceTime / totalInferences;
        std::cout << "[NovaML] 📊 Performance - Avg inference time: " << avgTime << "ms, Total: " << totalInferences << std::endl;
    }
} 