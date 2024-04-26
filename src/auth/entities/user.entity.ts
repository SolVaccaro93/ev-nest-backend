import { Prop,Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class User {

    id?: string;

    @Prop({ unique: true, required: true})
    email: string;
    
    @Prop({ unique: true, required: true})
    name: string;
    
 /*    //o unique true
    @Prop({unique: false, required: true})
    nickname: string; */

/*     @Prop()
    birthday: Date;

    @Prop()
    profilePicture: string;

    @Prop({required: true})
    phone: string;  //o number
 */
    @Prop({minlength:6, required:true})
    password?: string;

    @Prop({default:true})
    isActive: true;

    @Prop({ type: [String], default: ['user']})
    roles: string[]; //Role

/*     @Prop({type: String}) // crear entidad address
    address: string

    @Prop()
    favEpisodes : string []; */


}

export const UserSchema = SchemaFactory.createForClass(User);