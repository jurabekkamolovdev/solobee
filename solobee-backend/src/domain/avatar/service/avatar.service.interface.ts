// domain/avatar/service/avatar.service.interface.ts
import { AvatarGender } from 'src/datasource/avatar/model/avatar.entity';

export interface IAvatarService {
  createAvatar(params: ICreateAvatar): Promise<INewAvatar>;
  getAllAvatarsGrouped(): Promise<IGroupedAvatars>;
  deleteAvatar(id: string): Promise<void>;
}

export const AVATAR_SERVICE = Symbol('AVATAR_SERVICE');

export interface ICreateAvatar {
  gender: AvatarGender;
  thumbnailKey: string;
  orderIndex?: number;
}

export interface INewAvatar {
  id: string;
  gender: AvatarGender;
  thumbnailUrl: string | null;
  orderIndex: number;
}

export interface IGroupedAvatars {
  boy: INewAvatar[];
  girl: INewAvatar[];
}
