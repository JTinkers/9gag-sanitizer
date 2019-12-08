var patterns = []

chrome.storage.sync.get(['patterns'], function(result)
{
    if(result.patterns)
        patterns = result.patterns

    for (var i = 0; i < patterns.length; i++)
    {
        delete patterns[i].element
    }
});

function work()
{
    var posts = document.querySelectorAll("article")

    for (var x = 0; x < posts.length; x++)
    {
        var post = posts[x]

        var header = post.querySelector("header > a > h1")

        if(header)
        {
            for (var y = 0; y < patterns.length; y++)
            {
                var pattern = patterns[y]

                if(pattern.regex)
                {
                    var regex = new RegExp(pattern.value, "gi")

                    var match = header.textContent.match(regex)

                    if(match)
                        post.remove()

                    continue
                }

                if(header.textContent.toLowerCase().includes(pattern.value))
                    post.remove()
            }
        }
    }
}

window.addEventListener("load", function()
{
    work()
}, false)

let ticking = false;
let scrollPos = 0;
window.addEventListener("scroll", function(e)
{
    scrollPos = window.scrollY;

    if (!ticking)
    {
        window.requestAnimationFrame(function()
        {
            work()
            ticking = false
        });
    }

    ticking = true
})
