package com.argumentation.backendapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * GlobalCorsConfig
 * ----------------
 * This configuration class defines a global CORS (Cross-Origin Resource Sharing) policy.
 * It allows the Angular frontend (running on localhost:4200) to access backend REST APIs
 * hosted by the Spring Boot server.
 */
@Configuration // Marks this class as a source of Spring configuration.
public class GlobalCorsConfig {

    /**
     * Defines a WebMvcConfigurer bean that customizes CORS mappings for all API endpoints.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        // Returns an anonymous implementation of WebMvcConfigurer
        return new WebMvcConfigurer() {

            /**
             * Configures allowed origins, methods, and headers for cross-origin requests.
             * Here we permit the Angular app (localhost:4200) to make HTTP calls to /api/** routes.
             */
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")                   // Apply CORS policy to all endpoints starting with /api/
                        .allowedOrigins("http://localhost:4200")  // Allow requests from Angular's dev server
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
                        .allowedHeaders("*");                     // Allow all headers (Authorization, Content-Type, etc.)
            }
        };
    }
}
