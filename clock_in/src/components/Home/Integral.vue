<template>
  <div>
    <div class="login">
      <!-- 下拉刷新功能 -->
      <van-pull-refresh
        v-model="isLoading"
        :head-height="80"
        @refresh="onRefresh"
      >
        <!-- 下拉提示，通过 scale 实现一个缩放效果 -->
        <template #pulling="props">
          <img
            class="doge"
            src="https://img01.yzcdn.cn/vant/doge.png"
            :style="{ transform: `scale(${props.distance / 80})` }"
          />
        </template>

        <!-- 释放提示 -->
        <template #loosing>
          <img class="doge" src="https://img01.yzcdn.cn/vant/doge.png" />
        </template>

        <!-- 加载提示 -->
        <template #loading>
          <img class="doge" src="https://img01.yzcdn.cn/vant/doge-fire.jpg" />
        </template>
      </van-pull-refresh>
      <van-cell-group class="cardTop" inset>
        <img class="topHomeImg" src="./title.png" alt="" />
      </van-cell-group>
      <div class="topRow"></div>
      <van-cell-group class="cardTwo" inset>
        <section class="userNameROW">
          <div class="name">{{ ownInformation.userName }}</div>
          <div class="point">{{ ownInformation.allPoint }}</div>
        </section>
        <section class="rankROW">
          <div class="rank">
            <div class="rankOne">您的排名</div>
            <div class="NO">NO.</div>
            <p>{{ ownInformation.curRank }}</p>
          </div>
          <div class="rankRight">您的分数</div>
        </section>
      </van-cell-group>
      <div class="topRowTwo"></div>
      <div class="cardThree" inset>
        <div
          class="scroll"
          v-for="(item, index) in rankingIntegral"
          :key="item.id"
        >
          <div class="rankLeft">
            <div class="weiLeFlex">
              <div class="rankDingBu">
                <i
                  class="iconfont icon-paiming-xian icon-paihangOne"
                  v-if="index == 0"
                ></i>
                <i
                  class="iconfont icon-paiming-xian icon-paihangTwo"
                  v-if="index == 1"
                ></i>
                <i
                  class="iconfont icon-paiming-xian icon-paihangThree"
                  v-if="index == 2"
                ></i>
                <i
                  class="iconfont icon-paiming-xian"
                  v-if="index != 2 && index != 1 && index != 0"
                ></i>
              </div>
              <p>NO.{{ index + 1 }}</p>
            </div>
            <div class="userNameJuTi">
              <i class="iconfont icon-renwu-ren"></i>
              {{ item.userName }}
            </div>
          </div>
          <div class="rankRight">
            <div>{{ item.allPoint }}</div>
          </div>
          <!-- </van-loading> -->
        </div>
      </div>

      <van-tabbar v-model="active" active-color="#07C160" inactive-color="#000">
        <van-tabbar-item icon="bar-chart-o">排行</van-tabbar-item>
        <van-tabbar-item icon="home-o" @click="goHome">主页</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      //   排序数据
      list: [],
      loading: false,
      finished: false,
      // 用户的排名状况
      rankingIntegral: [],
      count: 0,
      //   自己的信息
      ownInformation: {},
      //  下拉刷新
      isLoading: false,
    };
  },
  created() {
    this.getIntergral();
    this.getOwnIntergral();
    // 定时器
    // setTimeout("test()", 1000);
  },
  methods: {
    goHome() {
      this.$router.push("/home");
    },
    //   页面打开获取用户的排名状况
    async getIntergral() {
      const { data: res } = await this.$http.get("/point/getRank");
      this.rankingIntegral = res;
    },
    // 获取自己的数据
    async getOwnIntergral() {
      const str = window.localStorage.getItem("token");
      const formData = new FormData();
      formData.append("token", str);
      const { data: res } = await this.$http.post(
        "/point/getCurRank",
        formData
      );
      this.ownInformation = res;
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;
      }, 1000);
    },
  },
};
</script>

<style lang='less' scoped>
@font-family: Georgia, Times, "Times New Roman", serif;
.login {
  height: 100vh;
}
.van-tabbar {
  height: 7rem;
  background: linear-gradient(145deg, #c4d2d4, #e5e6e3);
}
.van-tabbar-item--active {
  background: linear-gradient(145deg, #bfced1, #d2dbdb);
}
/* 顶部图片 */
.cardTop {
  width: 80%;
  height: 15rem;
  top: 2rem;
  background-color: #fff;
}
.topHomeImg {
  height: 100%;
  width: 100%;
}
.cardTwo {
  width: 80%;
  background-color: #fff;
}
.cardThree {
  border-radius: 0.6rem;
  height: 40rem;
  background-color: #f5f5f5;
  width: 80%;
  margin-bottom: 2rem;
  overflow: auto;
  padding: 1.5rem;
  border: 1px solid #18dcff;
  .scroll {
    background-color: #fefefe;
    margin-bottom: 1rem;
    padding: 0.1rem 1.3rem 1.3rem 1.3rem;
    display: flex;
    font-family: @font-family;
    font-size: 2rem;
    font-weight: 600;
    border-radius: 0.6rem;

    p {
      font-family: none;
    }
    // justify-content: space-between;
    .rankLeft {
      width: 15rem;
      .weiLeFlex {
        transform: translateY(1.7rem);
        display: flex;
        p {
          font-weight: 800;
          margin: 1rem 0 1.5rem 0.5rem;
          transform: translateY(-0.5rem);
          font-size: 2.3rem;
        }
      }
      .userNameJuTi {
        width: 18rem;
      }
      .rankDingBu {
        margin-bottom: 1rem;
        // 皇冠图标
        .icon-paihangOne {
          margin-right: 1rem;
          font-size: 2.4rem;
          color: #f0d897;
        }
        .icon-paihangTwo {
          margin-right: 1rem;
          font-size: 2.4rem;
          color: #bfd7e0;
        }
        .icon-paihangThree {
          margin-right: 1rem;
          font-size: 2.4rem;
          color: #d6b77a;
        }
        .icon-paiming-xian {
          //   margin-bottom: 1rem;
          margin-right: 1rem;
          font-size: 2.9rem;
        }
      }
    }
    .rankRight {
      transform: translateX(9rem);
      display: flex;
      align-items: center;
      font-family: none;
      font-weight: 400;
    }
  }
  // 人物图标
  .icon-renwu-ren {
    margin-right: 1rem;
    font-size: 2.5rem;
  }
}
.topRow {
  height: 5rem;
}
.topRowTwo {
  height: 1rem;
}
.van-list {
  height: 90px;
}
/* 个人排名 */
.cardTwo {
  padding: 1.2rem;
  color: #f1ddbf;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: @font-family;
  //   line-height: 1.5rem;
  //   padding: 2rem 4rem;
  background: linear-gradient(145deg, #bc8e4d, #e9bb7f);
  .userNameROW {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 5rem 0 2rem;
    .point {
      font-family: none;
      font-size: 2.5rem;
    }
    .name {
      font-size: 2rem;
    }
  }
  .rankROW {
    padding: 1rem 3rem 0rem 2rem;
    justify-content: space-between;

    display: flex;
    .rank {
      display: flex;
      .rankOne {
        font-size: 2.2rem;
      }
      .NO {
        margin-left: 1rem !important;
        font-size: 2.2rem !important;
        font-weight: 400;
        transform: translateY(0.3rem) !important;
      }
      p {
        margin: 0;
        padding: 0 0 0 0.2rem;
        font-size: 2.2rem !important;
        font-weight: 400;
        transform: translateY(0.3rem) !important;
        font-family: none;
      }
    }
    .rankRight {
      font-size: 2rem;
      transform: translateY(0.2rem);
    }
  }
}
//添加flex:1

.cardThree {
  flex: 1;
}
.doge {
  width: 140px;
  height: 72px;
  margin-top: 8px;
  border-radius: 4px;
}
</style>