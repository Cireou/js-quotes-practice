let quotes_url = "http://localhost:3000/quotes";
let likes_url = "http://localhost:3000/likes";

load_quotes();
add_form_funct();

function load_quotes(){
    qs("#quote-list").innerText = "";
    fetch(quotes_url + "?_embed=likes")
    .then(resp => resp.json())
    .then(quotes => {
        for (const quote of quotes){
            add_quote_DOM(quote);
        }
    })
}

function add_form_funct(){
    let form = qs("#new-quote-form");
    form.addEventListener("submit", () => {
        event.preventDefault();
        let data = {
            quote: event.target[0].value,
            author: event.target[1].value,
            likes: []
        };

        fetch(quotes_url, fetchObj("POST", data))
        .then(resp => resp.json())
        .then(new_quote => add_quote_DOM(new_quote))
        form.reset();
    })
}


function add_quote_DOM(quote){
    let list = qs("#quote-list");

    let li = ce("li");
    li.className = "quote-card";

        let block = ce("blockquote");
        block.className = "blockquote";
        
            let p = ce("p");
            p.className = "mb-0";
            p.innerText = quote.quote;

            let foot = ce("footer");
            foot.className = "blockquote-footer";
            foot.innerText = quote.author;

            let br = ce("br");

            let like_btn = ce("button");
            like_btn.className = "btn-success";
            like_btn.innerText = "Likes: "
            
                let span = ce("span");
                span.innerText = quote.likes.length;

            like_btn.addEventListener("click", () =>{
                fetch(likes_url, fetchObj("POST", like_data(quote.id)))
                .then(resp => resp.json())
                .then(like => {
                    quote.likes.push(like);
                    span.innerText = quote.likes.length;
                })
            })
            like_btn.append(span);
            
            let del_btn = ce("button");
            del_btn.className = "btn-danger";
            del_btn.innerText = "Delete";

            del_btn.addEventListener("click", () => {
                fetch(quotes_url + `/${quote.id}`,fetchObj("DELETE", null))
                .then(resp => load_quotes())
            })
            
        block.append(p, foot, br, like_btn, del_btn);
    li.append(block);
    list.append(li);
}

function fetchObj(request_type, data){

    let ret_Obj = {
        method: request_type, 
        headers: {
            "Content-type":"application/json"
        }
    }

    if (data){
        ret_Obj['body'] = JSON.stringify(data);
    }
    return ret_Obj;
}

function like_data(quote_id){
    return {
        quoteId: quote_id,
        createdAt: Date.now()
    }
}

function ce(item){
    return document.createElement(item);
}

function qs(item){
    return document.querySelector(item);
}
