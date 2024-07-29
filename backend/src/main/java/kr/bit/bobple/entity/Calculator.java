package kr.bit.bobple.entity;

import lombok.Data;

@Data
public class Calculator {

    public String text;
    public String imageUrl;


    public Calculator(String text, String imageUrl) {
        this.text = text;
        this.imageUrl = imageUrl;
    }
}
