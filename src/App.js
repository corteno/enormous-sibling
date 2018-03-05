import React, {Component} from 'react';
import thesaurus from 'thesaurus';
import './App.css';

class App extends Component {
    constructor() {
        super();

        this.state = {
            translateText: '',
            translatedText: ''
        };
    }

    sliceWords = (text) => {
        return text.split(/[ ]/,);

    };

    translate = (e) => {
        e.preventDefault();
        let originalWordsArray = this.sliceWords(this.state.translateText);
        let translatedWordsArray = [];


        originalWordsArray.forEach((word) => {
            //Save the original word so we can push it to the array in case it doesn't have a synonym
            let tempWord = word;

            //Check if word has punctiation (.?!,)
            let wordHasPunctuation = /(?:[A-Za-z]!)|(?:[A-Za-z],)|(?:[A-Za-z]\.)|(?:[A-Za-z]\?)/.test(word);
            //If it has remove that so we can get a result from the thesaurus library
            if (wordHasPunctuation) {
                tempWord = word.slice(0, word.length - 1);
            }

            let wordsTemp = thesaurus.find(tempWord.toLowerCase());
            if (wordsTemp.length > 0) {
                let randomItem = Math.floor(Math.random() * wordsTemp.length);
                translatedWordsArray.push(wordsTemp[randomItem]);
            } else {
                translatedWordsArray.push(word);
            }


        });

        for (let i = 0; i < originalWordsArray.length; i++) {
            //Check if the first letter of the original word is capitalized
            let isWordUppercase = /[A-Z]/.test(originalWordsArray[i].charAt(0));
            let wordHasPunctuation = /(?:[A-Za-z]!)|(?:[A-Za-z],)|(?:[A-Za-z]\.)|(?:[A-Za-z]\?)/.test(originalWordsArray[i]);

            //If first letter is capitalized
            if (isWordUppercase && translatedWordsArray[i] !== undefined) {
                translatedWordsArray[i] = translatedWordsArray[i]
                    .charAt(0).toUpperCase() + translatedWordsArray[i].slice(1, translatedWordsArray[i].length);
            }

            let translationHasPunctuation = /(?:[A-Za-z]!)|(?:[A-Za-z],)|(?:[A-Za-z]\.)|(?:[A-Za-z]\?)/.test(translatedWordsArray[i]);
            if(wordHasPunctuation && !translationHasPunctuation){
                console.log(translatedWordsArray[i]);
                translatedWordsArray[i] += originalWordsArray[i].charAt(originalWordsArray[i].length-1);
            }
        }

        //console.log(translatedWordsArray);

        this.setState({translatedText: translatedWordsArray.join(' ')});

    };

    onInputChange = (e) => {
        this.setState({translateText: e.target.value});
    };

    render() {
        return (
            <div className="app-wrapper col">
                <header className='app-header col'>
                    <h1 className="app-title">Enormous Sibling</h1>
                    <h2 className="app-subtitle">Translate your texts with a thesaurus!</h2>
                </header>
                <section className="app-content-wrapper">
                    <form action="" className="translate-form" onSubmit={(e) => {
                        this.translate(e)
                    }}>
                        <label htmlFor="translate" className='col'>
                            Text to translate:
                            <textarea name="translate" id="" cols="30" rows="10" className="translate"
                                      onChange={(e) => this.onInputChange(e)}
                                      value={this.state.translateText}
                            />
                        </label>
                        <input type="submit" className="translate-button" value='Translate'/>
                        <label htmlFor="translated-text" className='col'>
                            Translated text:
                            <textarea name="translated-text" id="" cols="30" rows="10" className="translated-text"
                                      value={this.state.translatedText}
                                      disabled/>
                        </label>
                    </form>
                </section>
                <footer>
                    <p className="made-by">
                        Made by <a href="https://borsodidavid.com" target='_blank'>Borsodi Dávid</a>
                        © {new Date().getFullYear()}
                    </p>
                </footer>
            </div>
        );
    }
}

export default App;
