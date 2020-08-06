import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    redirect: "/tools/pos"
  },
  {
    path: "/tools",
    component: () => import("@/views/Index.vue"),
    children: [
      {
        name: "POS",
        path: "pos",
        component: () => import("@/views/tools/POS.vue")
      },
      {
        name: "POSResult",
        path: "posresult/:id",
        component: () => import("@/views/tools/POSResult.vue")
      },
    ]
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
})

export default router;
