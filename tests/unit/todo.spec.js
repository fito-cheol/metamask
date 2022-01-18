import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import Todo from "@/components/Todo.vue";
import Vue from 'vue'
import Vuetify from "vuetify";

// vuetify import하는 정확한 방법 https://github.com/vuetifyjs/vuetify/discussions/4068#discussioncomment-24984
Vue.use(Vuetify)
const localVue = createLocalVue()


describe("Todo.vue", () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it("renders props.todoList when passed", async () => {

    const todoList = ["유닛 테스트 만들기", "E2E 테스트 만들기"];
    const wrapper = shallowMount(Todo, { Vuetify, localVue });
    wrapper.setProps({ todoList })
    await wrapper.vm.$nextTick()

    // https://vue-test-utils.vuejs.org/api/wrapper/#exists
    const div = wrapper.findAll("div").at(0);
    expect(div.find("span").exists()).toBe(true);
    expect(div.findAll("span")).toHaveLength(2);

    expect(div.findAll("span").at(0).text()).toMatch("유닛 테스트 만들기");
    expect(div.findAll("span").at(1).text()).toMatch("E2E 테스트 만들기");
  });

  it("텍스트 입력하고 클릭시 todo 생성하기", async () => {
    const wrapper = mount(Todo, { Vuetify, localVue });

    const textInput = wrapper.find("input");
    await textInput.setValue("some value");
    expect(wrapper.find("input").element.value).toBe("some value");

    expect(wrapper.find(".text_input").exists()).toBe(true);

    expect(wrapper.findAll(".todo")).toHaveLength(0);
    
    wrapper.find("button").trigger('click')

    await wrapper.vm.$nextTick() 

    expect(wrapper.text()).toMatch("some value")
    
    const div = wrapper.findAll("div").at(0);
    expect(div.findAllComponents({ref:"todo"})).toHaveLength(1);

    // 두개 같음 하나는 attribute로 찾고 하나는 ref로 찾고
    expect(div.findComponent({ref:"todoText0"}).text()).toBe("some value");
    expect(div.find('[data-cy="todoText0"]').text()).toBe("some value");

    expect(wrapper.emitted().value).toBeTruthy()
  });
  
});
