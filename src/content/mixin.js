export const actionMixin = {
  data () {
    return {
      userActionSets: [
        {
          getsture: '',
          label: '',
          act: ''
        }
      ]
    }
  },
  methods: {
    G_totop () {
      $("body,html").animate({
        scrollTop: 0
      }, 500)
    },
    G_tobottom () {
      $("body,html").animate({
        scrollTop: $(document).height(),
      }, 500)
    },
    G_back () {
      history.back()
    },
    G_forward () {
      history.forward()
    }
  }
}