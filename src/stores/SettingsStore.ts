import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('SettingsStore', {
  state: () => ({
    title: 'Atange',
    allowRegister: false,
    oneCollective: false,
    usersCanCreateCollectives: false,
    requireNames: false,
    settingsLoaded: false
  }),
  actions: {
    set(title: string, allowRegister: boolean, oneCollective: boolean, usersCanCreateCollectives: boolean, requireNames: boolean) {
      this.title = title,
      this.allowRegister = allowRegister
      this.oneCollective = oneCollective
      this.usersCanCreateCollectives = usersCanCreateCollectives
      this.requireNames = requireNames
      this.settingsLoaded = true
    }
  }
})
