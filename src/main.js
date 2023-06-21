import * as Keycloak from "keycloak-js";
import Vue from "vue";
import VueLogger from "vuejs-logger";
import App from "./App.vue";

Vue.config.productionTip = false;

const options = {
  isEnabled: true,
  logLevel: Vue.config.productionTip ? "error" : "debug",
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: "|",
  showConsoleColors: true
};
Vue.use(VueLogger, options);

//keycloak init options
let initOptions = {
  url: process.env.VUE_APP_AUTH_SERVER_URL,
  realm: process.env.VUE_APP_AUTH_REALM,
  clientId: process.env.VUE_APP_AUTH_CLIENT_ID,
  onLoad: "login-required"
};

let keycloak = Keycloak(initOptions);

keycloak
  .init({ onLoad: initOptions.onLoad })
  .success(auth => {
    if (!auth) {
      window.location.reload();
    } else {
      Vue.$log.info("Authenticated");
    }

    new Vue({
      render: h => h(App)
    }).$mount("#app");

    localStorage.setItem("vue-token", keycloak.token);
    localStorage.setItem("vue-refresh-token", keycloak.refreshToken);

    setInterval(() => {
      keycloak
        .updateToken(70)
        .success(refreshed => {
          if (refreshed) {
            Vue.$log.debug("Token refreshed");
          } else {
            Vue.$log.warn(
              "Token not refreshed, valid for " +
                Math.round(
                  keycloak.tokenParsed.exp +
                    keycloak.timeSkew -
                    new Date().getTime() / 1000
                ) +
                " seconds"
            );
          }
        })
        .error(() => {
          Vue.$log.error("Failed to refresh token");
        });
    }, 60000);
  })
  .error(() => {
    Vue.$log.error("Authenticated Failed");
  });
