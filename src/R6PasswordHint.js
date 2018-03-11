class R6PasswordHint {
    constructor(params) {
        this.builtInRules = ["smallLetter", "bigLetter", "digit", "lengthBetween"];
        this.inputField = params.inputField;
        this.hintScope = document.getElementById(`R6PasswordHint-${this.inputField.id}`);

        this.selectedRulesState = this._rulesSelectedByUser(params.rules);
        this.domElements = this._getDomElements();
        this._isValid = false;

        this._addEventListener();        
    }

    _getDomElements() {
        let result = {};

        for (let rule in this.selectedRulesState) {
            result[rule] = this.hintScope.querySelector(`.js-R6PasswordHint-${rule}`);
        }
        
        return result;
    }

    _rulesSelectedByUser (rules) {
        let state = {};

        this.builtInRules.forEach((value) => {
            if (rules[value] !== undefined) {
                //build-in rule
                state[value] = {
                    "counter": 0,
                    "shouldBe": rules[value]
                };
            } else {
                //customRule - TODO
            }
        });

        return state;
    }

    _addEventListener () {
        this.inputField.addEventListener("keyup", this._inputChanged.bind(this));
    }

    _inputChanged () {
        this._refreshState();        
        this._isConditionsFulfilled();
    }

    _refreshSmallLetterRuleState (value) {
        const smallLetters = value.match(/[a-z]/g);
        const smallLettersCounter = smallLetters !== null ? smallLetters.length : 0;
        this.selectedRulesState.smallLetter.counter = smallLettersCounter;
    }

    _refreshBigLetterRuleState (value) {
        const bigLetters = value.match(/[A-Z]/g);
        const bigLetterCounter = bigLetters !== null ?  bigLetters.length : 0;
        this.selectedRulesState.bigLetter.counter = bigLetterCounter;
    }

    _refreshDigitLetterRuleState (value) {        
        const digits = value.match(/[0-9]/g);
        const digitCounter = digits !== null ? digits.length : 0;
        this.selectedRulesState.digit.counter = digitCounter;
    }

    _refreshLengthBetweenRuleState (value) {
        const lengthBetween = value !== "" ? value.length : 0;
        this.selectedRulesState.lengthBetween.counter = lengthBetween;
    }

    _refreshState () {
        const value = this.inputField.value;
        
        if (this.selectedRulesState["smallLetter"]) {
            this._refreshSmallLetterRuleState(value);
        }

        if (this.selectedRulesState["bigLetter"]) {
            this._refreshBigLetterRuleState(value);
        }

        if (this.selectedRulesState["digit"]) {
            this._refreshDigitLetterRuleState(value);
        }

        if (this.selectedRulesState["lengthBetween"]) {
            this._refreshLengthBetweenRuleState(value);
        }
    }

    _isConditionsFulfilled () {     
        let validRules = 0;
        const numberOfUsedRules = Object.keys(this.selectedRulesState).length;

        for (let rule in this.selectedRulesState) {
            if (rule === "lengthBetween") {
                if (this.selectedRulesState[rule].counter >= this.selectedRulesState[rule].shouldBe[0] && 
                    this.selectedRulesState[rule].counter <= this.selectedRulesState[rule].shouldBe[1]) {
                    validRules += 1;
                    this._toggleClass(rule, true);
                }
                else {
                    this._toggleClass(rule, false);
                }
            } else if (this.selectedRulesState[rule].counter >= this.selectedRulesState[rule].shouldBe) {
                validRules += 1;
                this._toggleClass(rule, true);
            } else {
                this._toggleClass(rule, false);
            }
        }

        if (validRules === numberOfUsedRules) {
            this._isValid = true;
        } else {
            this._isValid = false;
        }
    }

    _toggleClass (ruleName, action) {
        const element = this.domElements[ruleName];

        if (action) {
            element.classList.add("R6PasswordHint-ok");
        } else {
            element.classList.remove("R6PasswordHint-ok");
        }
    }

    isValid () {
        return this._isValid;
    }
}