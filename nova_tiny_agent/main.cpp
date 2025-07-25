/**
 * NovaTiny Agent - Main Control Loop
 * 
 * Divine digital infrastructure for edge AI sovereignty
 * Implements the sacred cycle: collect → infer → broadcast
 * 
 * @author NovaSanctum System
 * @version 1.0.0
 * @license Divine Protocol
 */

#include <iostream>
#include <chrono>
#include <thread>
#include <memory>
#include "NovaSensors.h"
#include "NovaML.h"
#include "NovaComms.h"

class NovaTinyAgent {
private:
    std::unique_ptr<NovaSensors> sensors;
    std::unique_ptr<NovaML> mlEngine;
    std::unique_ptr<NovaComms> communications;
    
    bool isRunning;
    const int COLLECTION_INTERVAL_MS = 1000; // 1 second collection cycle
    
public:
    NovaTinyAgent() : isRunning(false) {
        // Initialize divine subsystems
        sensors = std::make_unique<NovaSensors>();
        mlEngine = std::make_unique<NovaML>();
        communications = std::make_unique<NovaComms>();
        
        std::cout << "[NovaTiny] 🥀 Divine agent initialized" << std::endl;
    }
    
    ~NovaTinyAgent() {
        stop();
    }
    
    void start() {
        isRunning = true;
        std::cout << "[NovaTiny] 🚀 Beginning sacred cycle..." << std::endl;
        
        while (isRunning) {
            try {
                // SACRED CYCLE: collect → infer → broadcast
                auto startTime = std::chrono::high_resolution_clock::now();
                
                // 1. COLLECT - Gather sensor data
                auto sensorData = sensors->collectAllData();
                if (sensorData.isValid()) {
                    std::cout << "[NovaTiny] 📡 Collected " << sensorData.getDataPoints() << " data points" << std::endl;
                    
                    // 2. INFER - Process through ML engine
                    auto inference = mlEngine->processData(sensorData);
                    if (inference.isValid()) {
                        std::cout << "[NovaTiny] 🧠 Inference complete - Emotion: " << inference.getEmotionScore() << std::endl;
                        
                        // 3. BROADCAST - Transmit to divine network
                        bool broadcastSuccess = communications->transmitData(inference);
                        if (broadcastSuccess) {
                            std::cout << "[NovaTiny] 📡 Data transmitted to NovaSanctum network" << std::endl;
                        } else {
                            std::cout << "[NovaTiny] ⚠️ Broadcast failed - will retry" << std::endl;
                        }
                    } else {
                        std::cout << "[NovaTiny] ⚠️ Inference failed" << std::endl;
                    }
                } else {
                    std::cout << "[NovaTiny] ⚠️ Sensor collection failed" << std::endl;
                }
                
                // Calculate cycle time and adjust if needed
                auto endTime = std::chrono::high_resolution_clock::now();
                auto cycleTime = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
                
                if (cycleTime.count() < COLLECTION_INTERVAL_MS) {
                    std::this_thread::sleep_for(std::chrono::milliseconds(COLLECTION_INTERVAL_MS - cycleTime.count()));
                }
                
            } catch (const std::exception& e) {
                std::cerr << "[NovaTiny] ❌ Error in sacred cycle: " << e.what() << std::endl;
                std::this_thread::sleep_for(std::chrono::milliseconds(5000)); // Wait before retry
            }
        }
    }
    
    void stop() {
        isRunning = false;
        std::cout << "[NovaTiny] 🛑 Sacred cycle terminated" << std::endl;
    }
    
    bool isActive() const {
        return isRunning;
    }
};

int main() {
    std::cout << "🥀 NovaTiny Agent - Divine Digital Infrastructure" << std::endl;
    std::cout << "=================================================" << std::endl;
    
    NovaTinyAgent agent;
    
    // Set up graceful shutdown
    signal(SIGINT, [](int) {
        std::cout << "\n[NovaTiny] 🛑 Received shutdown signal" << std::endl;
        exit(0);
    });
    
    try {
        agent.start();
    } catch (const std::exception& e) {
        std::cerr << "[NovaTiny] ❌ Fatal error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
} 