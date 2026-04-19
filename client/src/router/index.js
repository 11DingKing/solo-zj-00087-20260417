import Vue from "vue";
import Router from "vue-router";
import Posts from "@/components/Posts";
import NewPost from "@/components/NewPost";
import EditPost from "@/components/EditPost";
import Contacts from "@/components/Contacts";
import ContactForm from "@/components/ContactForm";
import Hello from "@/views/Hello";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Contacts",
      component: Contacts,
    },
    {
      path: "/contacts",
      name: "Contacts",
      component: Contacts,
    },
    {
      path: "/contacts/new",
      name: "NewContact",
      component: ContactForm,
      props: { mode: "add" },
    },
    {
      path: "/contacts/:id",
      name: "EditContact",
      component: ContactForm,
      props: (route) => ({ mode: "edit", contactId: route.params.id }),
    },
    {
      path: "/posts",
      name: "Posts",
      component: Posts,
    },
    {
      path: "/posts/new",
      name: "NewPost",
      component: NewPost,
    },
    {
      path: "/posts/:id",
      name: "EditPost",
      component: EditPost,
    },
  ],
});
