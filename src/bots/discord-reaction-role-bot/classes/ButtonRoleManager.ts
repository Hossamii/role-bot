import { ButtonInteraction, GuildMember, Snowflake } from "discord.js";
import { ButtonConfig, Config } from "../types";

class ButtonRoleManager {
  interaction: ButtonInteraction;
  config: Config;
  buttonConfig: ButtonConfig;
  member?: GuildMember;

  constructor(interaction: ButtonInteraction, config: Config, buttonConfig: ButtonConfig) {
    this.interaction = interaction;
    this.config = config;
    this.buttonConfig = buttonConfig;
  }

  get roleIds(): Snowflake[] {
    return this.buttonConfig.roleIds;
  }

  get allRuleRoleIds(): Snowflake[] {
    return [...new Set(this.config.buttons.flatMap((b) => b.roleIds))];
  }

  async handleRoles(): Promise<void> {
    await this.interaction.deferUpdate();

    if (!this.interaction.guild || !this.interaction.member) return;

    try {
      this.member = await this.interaction.guild.members.fetch(this.interaction.user.id);
    } catch {
      return;
    }

    const policy = this.config.policy ?? "unique";

    try {
      switch (policy) {
        case "once":
          if (!this._memberHasSomeRoleInAllRules()) {
            await this._addRoles();
          }
          break;

        case "any":
          if (this._memberHasAllRoles()) {
            await this._removeRoles();
          } else {
            await this._addRoles();
          }
          break;

        case "unique":
        default:
          if (this._memberHasAllRoles()) {
            await this._removeRoles();
          } else {
            await this._setUniqueRoles();
          }
          break;
      }
    } catch (err: any) {
      console.error(`Role operation failed: ${err.message}`);
    }
  }

  private _memberHasSomeRoleInAllRules(): boolean {
    return this.allRuleRoleIds.some((roleId) =>
      (this.member as GuildMember).roles.cache.has(roleId)
    );
  }

  private _memberHasAllRoles(): boolean {
    return this.roleIds.every((roleId) =>
      (this.member as GuildMember).roles.cache.has(roleId)
    );
  }

  private async _addRoles(): Promise<void> {
    await (this.member as GuildMember).roles.add(this.roleIds);
  }

  private async _removeRoles(): Promise<void> {
    await (this.member as GuildMember).roles.remove(this.roleIds);
  }

  private async _setUniqueRoles(): Promise<void> {
    const currentRoleIds = (this.member as GuildMember).roles.cache.map((r) => r.id);
    const roleIdsToSet = [
      ...currentRoleIds.filter((id) => !this.allRuleRoleIds.includes(id)),
      ...this.roleIds,
    ];
    await (this.member as GuildMember).roles.set(roleIdsToSet);
  }
}

export { ButtonRoleManager };
