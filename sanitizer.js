"use strict"

const patternHtml =
    `<input type="text" name="value" placeholder="<pattern>">
    <div class="checkbox-group">
        <label>
            <input type="checkbox"/>
            <span>
                Regex
            </span>
        </label>
    </div>
    <a class="remove-button" href="#"><i class="fas fa-times"></i></a>`

const list = document.querySelector("#patterns")

var patterns = []

function refresh()
{
    for (var i = 0; i < patterns.length; i++)
    {
        var pattern = patterns[i]

        if(pattern.element)
            continue

        var element = document.createElement("div")
        element.className = "pattern"
        element.innerHTML = patternHtml
        element.querySelector("input[type=checkbox]").checked = pattern.regex
        element.querySelector("input[type=text]").value = pattern.value

        element.querySelector("input[type=checkbox]").addEventListener("change", function()
        {
            save()
        })

        element.querySelector("input[type=text]").addEventListener("change", function()
        {
            save()
        })

        pattern.element = element

        list.appendChild(element)
    }

    var removeButtons = document.querySelectorAll(".remove-button")
    for (var i = 0; i < removeButtons.length; i++)
    {
        removeButtons[i].addEventListener("click", remove)
    }
}

function load()
{
    chrome.storage.sync.get(['patterns'], function(result)
    {
        if(result.patterns)
            patterns = result.patterns

        for (var i = 0; i < patterns.length; i++)
        {
            delete patterns[i].element
        }

        refresh()
    });
}

function save()
{
    for (var i = 0; i < patterns.length; i++)
    {
        var element = patterns[i].element

        if(!element)
            continue

        patterns[i].regex = element.querySelector("input[type=checkbox]").checked
        patterns[i].value = element.querySelector("input[type=text]").value
    }

    chrome.storage.sync.set({patterns: patterns}, function() {});
}

function add()
{
    patterns.push({regex: false, value: ""})

    save()

    refresh()
}

function remove(e)
{
    var index = Array.prototype.slice.call(list.children).indexOf(this.parentElement)

    patterns[index].element.remove()

    patterns.splice(index, 1)

    save()

    refresh()
}

document.addEventListener("DOMContentLoaded", function()
{
    load()

    var addButton = document.querySelector("#add-button")

    if(addButton)
        addButton.addEventListener("click", add)
}, false)
