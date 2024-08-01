// RecipeRecommendationException.java
package kr.bit.bobple.exception;

public class RecipeRecommendationException extends RuntimeException {
    public RecipeRecommendationException(String message) {
        super(message);
    }

    public RecipeRecommendationException(String message, Throwable cause) {
        super(message, cause);
    }
}
