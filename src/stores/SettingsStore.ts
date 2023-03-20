import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('SettingsStore', {
  state: () => ({
    title: '',
    oneCollective: false,
    usersCanCreateCollectives: true,
    requireNames: false,
    settingsLoaded: false
  }),
  actions: {
    set(title: string, oneCollective: boolean, usersCanCreateCollectives: boolean, requireNames: boolean) {
      this.title = title,
      this.oneCollective = oneCollective
      this.usersCanCreateCollectives = usersCanCreateCollectives
      this.requireNames = requireNames
      this.settingsLoaded = true
    }
  }
})
