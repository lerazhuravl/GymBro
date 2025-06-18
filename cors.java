@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000") // Разрешаем запросы с фронтенда
                    .allowedMethods("*"); // Разрешаем все HTTP-методы
            }
        };
    }
}
