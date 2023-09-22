# UserStyle

## UserStyle Manager

### Stylus
* Highly Recommended
* It is created after Stylish become shit.
* Open Source
* GitHub: https://github.com/openstyles/stylus
* Works with Chrome, Brave, Edge, Firefox, Opera, etc
* (Auto format and format checker is not working really well. Just ignore the warnings and errors)

### Firemonkey
* NOT Recommended
* It cannot handle `@preprocessor stylus`

## Guidelines
https://github.com/openstyles/stylus/wiki/Writing-UserCSS

## Preprocessor
### default
* [CSS documentation](https://learn.freecodecamp.org/responsive-web-design/basic-css/)
### uso
* [userstyles.org](https://userstyles.org/help/coding)
### less
* [less documentation](http://lesscss.org/#overview)
### stylus 
* [stylus-lang documentation](http://stylus-lang.com/)
* Highly Recommended

## Template

```scss

/* ==UserStyle==
@name           Hello World
@version        0.1.0
@namespace      github.com/openstyles
@license        MIT
@description    Description Here
@author         Author
@preprocessor   stylus
@var color      color-light               "Color (Light Theme)"                       #0cb8da
@var color      color-dark                "Color (Dark Theme)"                        #0c74e4
@var number     text-font-weight              "Text Font-Weight"                  [400, 100, 900, 100]
@var select     text-option              "Text Option"        {
"none": "none",
"option 1": "option-1"
}

==/UserStyle== */

dummy = 1




// ----- Main Frame ------

@-moz-document url-prefix("https://www.youtube.com/") {


    html{
        --my-color: color-light;
    }
    html[dark]{
        --my-color: color-dark;
    }



}

// ----- Iframe ------

@-moz-document url-prefix("https://www.youtube.com/live_chat") {
    
    
    html{
        --my-iframe-color: color-light;
    }
    html[dark]{
        --my-iframe-color: color-dark;
    }

}


```
