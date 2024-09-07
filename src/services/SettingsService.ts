import { getCustomRepository, Repository } from "typeorm";
import { Setting } from "../entities/Setting";
import { SettingsRepository } from "../repositories/SettingsRepository";

interface ISettingsCreate {
  chat: boolean;
  username: string;
}

class SettingsService {
  private repository: Repository<Setting>;

  constructor() {
    this.repository = getCustomRepository(SettingsRepository);
  }

  async create({ chat, username }: ISettingsCreate) {
    // SELECT * FROM settings WHERE settings.username = username limit 1;
    const userAlreadyExists = await this.repository.findOne({
      username
    });

    if (userAlreadyExists) {
      throw new Error("User already exists!");
    }

    const settings = this.repository.create({
      chat,
      username,
    })

    await this.repository.save(settings);

    return settings;
  }

  async findByUsername(username: string) {
    const setting = await this.repository.findOne({
      username,
    });

    return setting;
  }

  async update(username: string, chat: boolean) {
    const settings = await this.repository.createQueryBuilder()
      .update(Setting)
      .set({ chat })
      .where("username = :username", {
        username
      })
      .execute();
  }
}

export { SettingsService };