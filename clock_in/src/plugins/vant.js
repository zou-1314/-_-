import Vue from 'vue'
import {
    Field, Form, Button, Icon, Toast, Tab, Tabs, Cell, CellGroup,
    Tabbar, TabbarItem, Uploader, List, PullRefresh, Loading, Sticky
} from 'vant'
Vue.use(Field).use(Form).use(Button).use(Icon).use(Tab).use(Tabs).use(Cell)
    .use(CellGroup).use(Tabbar).use(TabbarItem).use(Uploader).use(List)
    .use(Loading).use(PullRefresh).use(Sticky)
Vue.prototype.$toast = Toast
Toast.setDefaultOptions({ duration: 1400 });