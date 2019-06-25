

class Search{
    constructor(){
        this.engine = localStorage.getItem("search-engine");
        if(!this.engine){
            this.engine = 'https://www.baidu.com';
            localStorage.setItem('search-engine', this.engine);
        }else{
            let eles = document.querySelectorAll("#search-option option");
            for(let i = 0; i < eles.length; i++){
                if(eles[i].getAttribute("data-url") == this.engine){
                    eles[i].parentNode.selectedIndex = i;
                    break;
                }
            }
        }
        //绑定事件
        document.querySelector("#search-option").onchange = (evt) => {
            const ele = evt.target || evt.srcElement;
            let index = ele.selectedIndex;
            let url = ele.querySelectorAll("option")[index].getAttribute('data-url');
            this.engine = url;
            localStorage.setItem('search-engine', this.engine);
        };
        document.querySelector(".search-sure").onclick = (evt) => {
            let ele = evt.target || evt.srcElement;
            ele = ele.previousSibling;
            while(ele.nodeType != 1)
                ele = ele.previousSibling;
            let text = ele.value;
            ele.value = "";
            this.startSearch(text);
        };
        document.querySelector(".search-input").onkeydown = (evt) =>{
            if(evt.keyCode == 13){
                let ele = evt.target || evt.srcElement;
                let text = ele.value;
                ele.value = '';
                this.startSearch(text);
            }
        };
    }
    startSearch(text){
        let url = this.engine;
        if(/www.baidu.com/.test(this.engine)){
            url += '/s?wd=' + text;
        }else if(/www.bing.com/.test(this.engine)){
            url += '/search?q=' + text;
        }else if(/www.google.com/.test(this.engine)){
            url += '/serach?q=' + text;
        }else if(/www.sogo.com/.test(this.engine)){
            url += '/web?query=' + text;
        }
        window.open(url, "_blank");
    }
}

export {Search};