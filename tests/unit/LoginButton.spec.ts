import { shallowMount } from '@vue/test-utils'
import LoginButton from '@/components/LoginButton.vue'

describe('LoginButton.vue', () => {
  it('renders props.msg when passed', () => {
    const msg: string = '登入'
    const wrapper = shallowMount(LoginButton, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
    expect(wrapper.is('button')).toBe(true)
    expect(wrapper).toMatchSnapshot()
  })
})
