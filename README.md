##TimeController - 电脑使用时间控制器  
#该软件需要python3环境和浏览器对ES6的原生支持(亲测Edge、Chrome和Firefox均支持)  

安装方式：  
Windows系统：  
	将timeController.vbs链接到 “C:\Users\asus\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup” 中。
Linux/Mac系统：
	在启动项中加入 python3 Server.py

功能介绍：  

这是一个B/S程序，使用 http://127.0.0.1:5768/index.html访问  
具有搜索、电脑使用时间控制和使用时间统计功能
按搜索框下面的 ***齿轮*** 键或者使用热键 ***o*** 唤出设置菜单。  
热键 ***j*** 和 ***k*** 上下滚动设置菜单。  
热键 ***q*** 或 ***ESC*** 关闭设置菜单。  
热键 ***i*** 使搜索框获得焦点，热键 ***ESC*** 使搜索框失去焦点。  

js/KeyRigister.js 可以改动，注册你自己的热键和功能， 使用key_XX (XX为keyCode)。  
按动任意键可在控制台看到这个键位是否已经被注册以及这个键的键位。  

在搜索框中输入内容后按 ***Enter*** 或点击 ***搜索*** 按钮即可进行搜索。   
若搜索内容以http、https或www打头，则直接进入网址，若是其它内容，则会跳转到搜索引擎。  
搜索引擎可以在设置菜单中设置，支持百度、搜狗、必应、谷歌。


***注意：这个程序可能会比较暴烈，一天累计使用时间达到后或者超过你设置的（使用电脑）最晚时间将会导致计算机当天无法开机，请注意设置。***