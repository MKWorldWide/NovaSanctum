/**
 * NovaML.h - Machine Learning Engine
 * 
 * Quantized model loading and inference for NovaTiny agents
 * Processes sensor data to extract emotional and behavioral insights
 * 
 * @author NovaSanctum System
 * @version 1.0.0
 * @license Divine Protocol
 */

#ifndef NOVA_ML_H
#define NOVA_ML_H

#include <string>
#include <vector>
#include <memory>
#include <chrono>

// Forward declarations
struct SensorData;
struct InferenceResult;

/**
 * Emotion classification categories
 */
enum class EmotionCategory {
    CALM = 0,
    EXCITED = 1,
    STRESSED = 2,
    FOCUSED = 3,
    RELAXED = 4,
    ANXIOUS = 5,
    UNKNOWN = 6
};

/**
 * Inference result structure
 */
struct InferenceResult {
    EmotionCategory emotion;
    double emotionScore; // 0.0 to 1.0
    double confidence;
    std::chrono::system_clock::time_point timestamp;
    std::string deviceId;
    std::vector<double> featureVector;
    
    InferenceResult() : emotion(EmotionCategory::UNKNOWN), emotionScore(0.0), confidence(0.0) {}
    
    bool isValid() const { return confidence > 0.0; }
    
    std::string getEmotionString() const {
        switch (emotion) {
            case EmotionCategory::CALM: return "calm";
            case EmotionCategory::EXCITED: return "excited";
            case EmotionCategory::STRESSED: return "stressed";
            case EmotionCategory::FOCUSED: return "focused";
            case EmotionCategory::RELAXED: return "relaxed";
            case EmotionCategory::ANXIOUS: return "anxious";
            default: return "unknown";
        }
    }
};

/**
 * Feature extraction interface
 */
class FeatureExtractor {
public:
    virtual ~FeatureExtractor() = default;
    virtual std::vector<double> extractFeatures(const SensorData& data) = 0;
    virtual bool isInitialized() const = 0;
};

/**
 * Model interface for inference
 */
class InferenceModel {
protected:
    std::string modelPath;
    bool isLoaded;
    double inferenceThreshold;
    
public:
    InferenceModel(const std::string& path = "") : modelPath(path), isLoaded(false), inferenceThreshold(0.5) {}
    virtual ~InferenceModel() = default;
    
    virtual bool loadModel() = 0;
    virtual InferenceResult predict(const std::vector<double>& features) = 0;
    virtual void unloadModel() = 0;
    
    bool isModelLoaded() const { return isLoaded; }
    std::string getModelPath() const { return modelPath; }
    void setInferenceThreshold(double threshold) { inferenceThreshold = threshold; }
};

/**
 * Quantized model implementation
 */
class QuantizedModel : public InferenceModel {
private:
    // Model parameters (simplified for demonstration)
    std::vector<std::vector<double>> weights;
    std::vector<double> biases;
    int inputSize;
    int outputSize;
    
public:
    QuantizedModel(const std::string& path);
    ~QuantizedModel();
    
    bool loadModel() override;
    InferenceResult predict(const std::vector<double>& features) override;
    void unloadModel() override;
    
private:
    std::vector<double> quantizeFeatures(const std::vector<double>& features);
    EmotionCategory classifyEmotion(const std::vector<double>& probabilities);
};

/**
 * Main ML engine class
 */
class NovaML {
private:
    std::unique_ptr<FeatureExtractor> featureExtractor;
    std::unique_ptr<QuantizedModel> model;
    std::string deviceId;
    bool isInitialized;
    
    // Performance tracking
    std::chrono::system_clock::time_point lastInference;
    double averageInferenceTime;
    int totalInferences;
    
public:
    NovaML(const std::string& deviceId = "nova_tiny_001");
    ~NovaML();
    
    bool initialize(const std::string& modelPath = "models/emotion_classifier.qmodel");
    InferenceResult processData(const SensorData& sensorData);
    void shutdown();
    
    // Performance metrics
    double getAverageInferenceTime() const { return averageInferences > 0 ? averageInferenceTime / totalInferences : 0.0; }
    int getTotalInferences() const { return totalInferences; }
    std::chrono::system_clock::time_point getLastInference() const { return lastInference; }
    
    bool isSystemInitialized() const { return isInitialized; }
    std::string getDeviceId() const { return deviceId; }
    
private:
    void updatePerformanceMetrics(double inferenceTime);
};

#endif // NOVA_ML_H 