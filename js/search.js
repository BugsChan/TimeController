

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
        const searchInput = document.querySelector(".search-input");
        searchInput.onkeydown = (evt) =>{
            let ele = evt.target || evt.srcElement;
            if(evt.keyCode == 13){
                let text = ele.value;
                ele.value = '';
                this.startSearch(text);
            }else if(evt.keyCode == 38){
                //up
                this.scroll(ele, "up");
            }else if(evt.keyCode == 40){
                //down
                this.scroll(ele, "down");
            }
//            else if(evt.keyCode == 74){
//                //up
//
//            }else if(evt.keyCode == 75){
//                //down
//            }
        };
        searchInput.addEventListener("input", (evt) => {
            const target = evt.target || evt.srcElement;
            this.associate(target);
        });
		searchInput.focus();
		searchInput.addEventListener("blur", (evt) => {
		    let dom = document.querySelector("#associate-dom");
		    if(dom && dom.getAttribute("data-clear") != 'false')dom.style.display = "none";
		});
		searchInput.addEventListener("focus", () => {
		    let ul = document.querySelector("#associate-dom");
		    if(!ul || ul.style.display == "none")return;
		    let span = ul.querySelector("li span");
		    if(span)searchInput.value = span.innerText;
		});
    }
    startSearch(text){
        this.recordSearch(text)
        let url = this.engine;
        if(/^www\./.test(text)){
            url = "http://" + text;
        }else if(/^http[s]?:/.test(text)){
            url = text;
        }else if(/www.baidu.com/.test(this.engine)){
            url += '/s?wd=' + text;
        }else if(/www.bing.com/.test(this.engine)){
            url += '/search?q=' + text;
        }else if(/www.google.com/.test(this.engine)){
            url += '/search?q=' + text;
        }else if(/www.sogo.com/.test(this.engine)){
            url += '/web?query=' + text;
        }
        let child = window.open(url, "_blank");
        child.addEventListener("load", () => {
            child.addEventListener("keydown", (evt) => {
                if(evt.keyCode == 27){
                    child.close();
                }
            });
        });
    }
    findRecord(){
        if(!this.record){
            this.record = localStorage.getItem("search-record");
            if(!this.record)
                this.record = [];
            else
                this.record = JSON.parse(this.record);
        }
    }
    recordSearch(text){
        this.findRecord();
        this.record.push(text);
        while(this.record.length > 500)
            this.record.shift();
        localStorage.setItem('search-record', JSON.stringify(this.record));
        this.scrollNum = 0;
    }
    scroll(ele, aim){
        this.findRecord();
        if(this.record.length == 0)return;
        if(!this.scrollNum)this.scrollNum = 0;
        this.scrollNum += (aim == "up" ? 1 : -1);
        if(this.scrollNum > this.record.length)
            this.scrollNum -= 1;
        else if(this.scrollNum <= 0){
            let dom = document.querySelector("#associate-dom");
            this.scrollNum = 0;
            if(dom.style.display == 'none'){
                ele.value = '';
            }
            return;
        }
        let index = this.record.length - this.scrollNum;
        ele.value = this.record[index];
    }
    associate(target){
        //创建dom
        let dom = document.querySelector("#associate-dom");
        if(!dom){
            dom = document.createElement("ul");
            dom.id = "associate-dom";
            document.querySelector("main").insertBefore(dom, document.getElementById("bg-setting"));
            dom.style.position = "absolute";
            dom.style.top = target.parentNode.offsetTop + target.offsetHeight + 'px';
            dom.style.left = target.offsetLeft + 'px';
            dom.style.cursor = "default";
            setInterval(() => {
                dom.style.top = target.parentNode.offsetTop + target.offsetHeight + 'px';
                dom.style.left = target.offsetLeft + 'px';
            }, 1000);
            dom.addEventListener('mouseover', (evt) => {
                let target = evt.target || evt.srcElement;
                while(target.tagName.toLowerCase() != "li" &&
                    target.tagName.toLowerCase() != "ul"){
                    target = target.parentNode;
                }
                if(target.tagName.toLowerCase() == 'ul'){
                    return;
                }else{
                    dom.setAttribute("data-clear", "false");
                    for(let each of target.parentNode.childNodes){
                        each.style.backgroundColor = '#eee';
                        each.setAttribute("data-hover", "false");
                    }
                    target.style.backgroundColor = "#ccc";
                    target.setAttribute("data-hover", "true");
                    let input = document.querySelector(".search .search-input");
                    input.blur();
                    input.value = target.innerText;
                }
            });
            dom.addEventListener("mouseout", () => {
                dom.setAttribute("data-clear", "true");
                for(let each of dom.childNodes){
                    each.style.backgroundColor = '#eee';
                }
            });
            dom.addEventListener("click", (evt) => {
                let target = evt.target || evt.srcElement;
                while(target.tagName.toLowerCase() != "li" &&
                    target.tagName.toLowerCase() != "ul"){
                    target = target.parentNode;
                }
                if(target.tagName.toLowerCase() == 'ul'){
                    return;
                }else{
                    dom.style.display = 'none';
                    document.querySelector(".search .search-input").value = '';
                    let text = target.innerText;
                    this.startSearch(text);
                }
            });
            window.addEventListener("keydown", (evt) => {
                let dom = document.querySelector("#associate-dom");
                let setting = document.getElementById("bg-setting");
                if(!dom || (setting.style && setting.style.display == 'block')){
                    return;
                }else if(!dom.style.display || dom.style.display != 'none'){
                    if(evt.keyCode == 13){
                        for(let each of dom.childNodes){
                            if(each.getAttribute("data-hover") == 'true'){
                                dom.style.display = 'none';
                                document.querySelector(".search .search-input").value = '';
                                let text = each.innerText;
                                this.startSearch(text);
                            }
                        }
                    }else if(evt.keyCode == 38 || evt.keyCode == 40){
                        let aim = evt.keyCode == 38 ? "up" : 'down';
                        let target = null;
                        dom.setAttribute("data-clear", "false");
                        for(let each of dom.childNodes){
                            if(each.getAttribute("data-hover") == "true"){
                                target = aim == "up" ? each.previousSibling : each.nextSibling;
                                each.setAttribute("data-hover", "false");
                                each.style.backgroundColor = '#eee';
                                break;
                            }
                        }
                        if(!target)target = dom.firstChild;
                        if(target.style.display == 'none'){
                            target = target.previousSibling;
                            target.setAttribute("data-hover", 'true');
                            target.style.backgroundColor = '#ccc';
                            return;
                        }
                        target.style.backgroundColor = "#ccc";
                        target.setAttribute("data-hover", "true");
                        let input = document.querySelector(".search .search-input");
                        input.blur();
                        input.value = target.innerText;
                    }
                }
            });
        }else{
            dom.style.display = "block";
        }

        //获取可能的搜索值
        let possible = [];
        let value = target.value;
        if(value != ''){
            value = new RegExp(value);
            this.findRecord();
            for(let each of this.record){
                if(value.test(each)){
                    possible.unshift(each);
                }
            }
        }

        //删除possible中重复的对象，并提高重复对象的权重
        let possible_tmp = {};
        for(let each of possible){
            if(each in possible_tmp){
                possible_tmp[each] ++;
            }else{
                possible_tmp[each] = 1;
            }
        }
        let max;
        let max_sentence = "";
        possible = [];
        do{
            max = 0;
            for(let each in possible_tmp){
                if(possible_tmp[each] > max){
                    max_sentence = each;
                    max = possible_tmp[each];
                }
            }
            possible_tmp[max_sentence] = 0;
            if(max != 0)possible.push(max_sentence);
        }while(max != 0);

        //创建多个li对象
        let lis = dom.querySelectorAll("li");
        if(lis.length == 0){
            lis = [];
            for(let i = 0; i < 5; i++){
                let li = document.createElement("li");
                li.style.height = target.offsetHeight + 'px';
                li.style.listStyle = "none";
                li.style.width = target.offsetWidth - 5 + 'px';
                li.style.backgroundColor = "#eee";
                li.style.display = 'none';
                li.style.paddingLeft = '5px';
                li.style.borderBottom = "solid #cacaca 0.5px";
                li.style.lineHeight = target.offsetHeight + 'px';
                li.style.overflow = 'hidden';
                dom.appendChild(li);
                lis.push(li);
            }
        }else{
            for(let li of lis){
                li.style.display = 'none';
                li.style.backgroundColor = "#eee";
            }
        }

        //填充对象
        let putted = true;
        this.rest = [];
        for(let each of possible){
            if(putted){
                putted = false;
                for(let li of lis){
                    if(li.style.display == 'none'){
                        li.style.display = 'block';
                        li.innerHTML = each.replace(value, '<span style="font-weight:bold;">'+value.source + '</span>');
                        putted = true;
                        break;
                    }
                }
            }else{
                this.rest.push(each);
            }
        }
    }
}

export {Search};