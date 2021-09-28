// 设置笔记的链接
var nameLink;
if (location.host == "localhost:3000") {
  nameLink = 'http://localhost:3000/#/README'
} else {
  nameLink = 'https://web-ws.github.io/JavaReader/#/README'
}

window.$docsify = {
  // 笔记本名称
  name: '<p>📘 JavaReader</p>',
  // 笔记本链接
  nameLink: nameLink,
  // github图标
  repo: 'web-ws/JavaReader',
  // 切换页面后，跳转到顶部页面
  auto2top: true,
  // 让你的内容页在滚动到指定的锚点时，距离页面顶部有一定空间。
  topMargin: 10,
  // 封面
  coverpage: true,
  // 封面和内容单独显示
  onlyCover: true,
  // 是否加载导航栏
  //loadNavbar: true,
  // 在小屏幕上,导航栏与侧边栏合并
  mergeNavbar: true,
  notFoundPage: true,
  // 外链打开方式：_blank表示在新标签页中打开
  externalLinkTarget: '_blank',
  // 页签
  //pagination: {
  //  previousText: "上一篇",
  //  nextText: "下一篇",
  //  crossChapter: true,
  //  crossChapterText: true,
  //},
  // 编辑当前文档按钮
  formatUpdated: '{YYYY}/{MM}/{DD} {HH}:{mm}',
  plugins: [
    function(hook, vm) {
      hook.beforeEach(function (html) {
        var url = 'https://github.com/web-ws/JavaReader/tree/master/' + vm.route.file
        var editHtml = '[📝 Edit on GitHub](' + url + ')\n'
        var editHtml_end = '[🖊 Edit on GitHub](' + url + ')\n'
        return '> Begin ' + editHtml
          + html
          + '\n----\n'
          + '> End '
          + editHtml_end
      })
    }
  ],
  // 页脚
  footer: {
    copy: '<span>Copyright &copy; 2020 - 2021</span>',
    //copy: '<span id="sitetime"></span> <br/>',
    auth: '<a href="https://web-ws.github.io/JavaReader/" target="_blank">🏷️ GitHub NoteBook</a>',
    pre: '<hr/>',
    style: 'text-align: left;',
  },
  // 搜索框
  search: {
    paths: 'auto',
    placeholder: '🔍 搜索全文',
    noData: '😒 找不到结果',
    depth: 6,
    maxAge: 86400000, // 过期时间，单位毫秒，默认一天
  },
  // 字数统计
  count:{
    countable:true,
    fontsize:'0.9em',
    color:'rgb(90,90,90)',
    language:'chinese'
  },
  // 白夜切换
  darklightTheme: {
    defaultTheme: 'light',
    siteFont: 'Source Sans Pro,Helvetica Neue,Arial,sans-serif',
    codeFontFamily: 'Roboto Mono, Monaco, courier, monospace',
    bodyFontSize: '15px',
    dark: {
      background: 'rgb(28,32,34)',
      highlightColor: '#e96900',
      codeBackgroundColor: 'rgb(34,39,46)',
      codeTextColor: '#b4b4b4',
    },
    light: {
      highlightColor: '#e96900',
    }
  },
}

<!-- docsify插件 -->
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/docsify/docsify.min.js"></script>
<!-- 复制剪贴板 -->
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/docsify/docsify-copy-code.min.js"></script>
<!-- 页脚功能 -->
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/docsify/docsify-footer-enh.min.js"></script>
<!-- 搜索功能 -->
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/other/search.min.js"></script>
<!-- 图片缩放 -->
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/other/zoom-image.min.js"></script>
<!-- 字数统计 -->
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/other/countable.js"></script>
<!-- 鼠标点击 -->
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/other/click_heart.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/other/index.js"></script>
<!-- 解析emoji -->
<script src="https://cdn.jsdelivr.net/npm/docsify/lib/plugins/emoji.min.js"></script>
<!-- 白夜切换 -->
<script src="//cdn.jsdelivr.net/npm/docsify-darklight-theme@latest/dist/index.min.js"></script>
<!-- 代码块样式优化-->
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-java.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-python.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-c.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-javascript.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-css.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-sql.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-yaml.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-docker.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-bash.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-json.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-latex.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-yaml.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-scala.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/prism/prism-markdown.js"></script>
<!-- 回到顶部功能 -->
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/other/jquery.js"></script>
<script src="https://cdn.jsdelivr.net/gh/web-ws/JavaReader@master/plugins/js/other/jquery.goup.js"></script>
$(document).ready(function() {
  $.goup({
    trigger: 100,
    bottomOffset: 52,
    locationOffset: 25,
    //title: '🚀',
    titleAsText: true
  });
});
