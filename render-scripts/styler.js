/**
 * Created by vesel on 31.12.2016.
 */

class Styler {
    constructor () {
        this.syntax = {
            "__": "strong",
            "**": "strong",
            "-" : "em",
            "*" : "em"
        }
    }

    getNthIndex (string, substring, index) {
        index += 1
        var L = string.length, i = -1;
        while (index-- && i++ < L) {
            i = string.indexOf(substring, i);
            if (i < 0) break;
        }
        return i;
    }

    /**
     * Checks whether a markdown syntax element should be styled
     * @param text
     * @param index
     */
    isEligableForReplacement (text, index, expression, replacementTag) {
        if (text.substring(index - 1, 1) == ">") // tag behind
            return false;
        if (text.substring(index + expression.length, 1) == "</") // tag before
            return false;
        if (text.substring(index - 1, 1) == "\\")
            return false;

        return true;
    }

    styleTextarea (textArea) {
        let openedTags = {}
        Object.keys(this.syntax).forEach((key) => {
            openedTags[key] = false
        })

        Object.keys(this.syntax).forEach((key) => {
            let replacement = this.syntax[key]
            let expressionIndex = textArea.innerHTML.indexOf(key);
            if (expressionIndex !== -1 && this.isEligableForReplacement(textArea.innerHTML, expressionIndex, replacement)) {
                textArea.innerHTML = textArea.innerHTML.replace(key, openedTags[key] ? "</" + replacement + ">" + key : key + "<" + replacement + ">")
                openedTags[key] = !openedTags[key]
            }
        })
    }

    styleText (htmlText) {
        Object.keys(this.syntax).forEach((item) => {
            let replacement = this.syntax[item]
            let cIndex = 0; // the number of the current expression
            let sIndex // the index of the expression within the string

            //console.log("looking for ", item)
            sIndex = this.getNthIndex(htmlText, item, cIndex)
            //console.log("Index ", sIndex)
            while (sIndex !== -1) {
                let newText = htmlText.substring(0, sIndex)
                newText += (cIndex % 2 == 0) ? "<" + replacement + ">" : "</" + replacement + ">"
                newText += htmlText.substring(sIndex, 0)

                //console.log("inserting: ", replacement)

                htmlText = newText
                cIndex++
                sIndex = this.getNthIndex(htmlText, item, cIndex)
            }
        })

        console.log(htmlText)
        return htmlText
    }
}

module.exports = {"Styler": Styler};