import React, {Component} from 'react';
import thesaurus from 'thesaurus';
import './App.css';

class App extends Component {
    constructor() {
        super();

        this.state = {
            translateText: '',
            translatedText: '',
            copyText: '',
            copyOriginal: false
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

            //In case that the word has punctuation and there is no synonym.
            let translationHasPunctuation = /(?:[A-Za-z]!)|(?:[A-Za-z],)|(?:[A-Za-z]\.)|(?:[A-Za-z]\?)/.test(translatedWordsArray[i]);
            if (wordHasPunctuation && !translationHasPunctuation) {
                console.log(translatedWordsArray[i]);
                translatedWordsArray[i] += originalWordsArray[i].charAt(originalWordsArray[i].length - 1);
            }
        }
        this.setState({translatedText: translatedWordsArray.join(' ')});
    };

    onInputChange = (e) => {
        switch (e.target.name) {
            case 'translate':
                this.setState({translateText: e.target.value});
                break;

            case 'copy-all':
                this.setState({copyOriginal: !this.state.copyOriginal});
                break;

            default:
                break;
        }

    };

    onCopyButtonClick = (e) => {
        e.preventDefault();
        this.setState({copying: true});

        if (this.state.copyOriginal) {
            this.setState({copyText: this.state.translateText + ' -> ' + this.state.translatedText}, () => {

                this.copyInput.select();
                document.execCommand('copy');

                this.setState({copying: false});
            });
        } else {
            this.setState({copyText: this.state.translatedText}, () => {

                this.copyInput.select();
                document.execCommand('copy');

                this.setState({copying: false});
            });
        }
    };

    componentDidMount() {
        this.translateTextarea.focus();
    }

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
                        <label htmlFor="translate" className='translate-wrapper col'>
                            Text to translate:
                            <textarea name="translate" id="" cols="30" rows="10" className="translate"
                                      onChange={(e) => this.onInputChange(e)}
                                      value={this.state.translateText}
                                      ref={(textarea) => {
                                          this.translateTextarea = textarea
                                      }}
                            />
                        </label>
                        <input type="submit" className="translate-button" value='Translate'/>
                        <label htmlFor="translated-text" className='translate-wrapper col'>
                            Translated text:
                            <textarea name="translated-text" id="" cols="30" rows="10" className="translated-text"
                                      value={this.state.translatedText}

                                      disabled/>
                            <div className='copy-wrapper'>
                                <label htmlFor="copy-all" className='copy-all-label'
                                       defaultChecked={this.state.copyOriginal}
                                       onChange={(e) => this.onInputChange(e)}>
                                    <p>Copy with original</p>
                                    <input type="checkbox" name='copy-all' className="copy-all-checkbox"/>
                                </label>
                                <button className="copy-text-button"
                                        onClick={(e) => this.onCopyButtonClick(e)}
                                >Copy text
                                </button>
                            </div>
                        </label>
                    </form>
                    {this.state.copying ?
                        <input type="text" className='hide' value={this.state.copyText}
                               readOnly={true}
                               ref={(input) => {
                                   this.copyInput = input
                               }}
                        />
                        : ''
                    }
                </section>
                <footer>
                    <p className="made-by">
                        Made by <a href="https://borsodidavid.com" target='_blank' rel="noopener noreferrer">Borsodi
                        Dávid</a>
                        © {new Date().getFullYear()}
                    </p>
                </footer>
            </div>
        );
    }
}

export default App;
