import bcrypt from "bcrypt";
import {
    BaseEntity,
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity, ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {IsEmail} from "class-validator";
import Chat from "./Chat";
import Message from "./Message";
import Verification from "./Verification";
import Ride from "./Ride";

// 암호화 할 횟수
const BCRYPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text", nullable: true})
    @IsEmail()
    email: string | null;

    @Column({type: "boolean", default: false})
    verifiedEmail: boolean;

    @Column({type: "text"})
    firstName: string;

    @Column({ type: "text" })
    lastName: string;

    @Column({ type: "int" , nullable: true})
    age: number;

    @Column({ type: "text" })
    password: string;

    @Column({ type: "text" })
    phoneNumber: string;

    @Column({ type: "boolean", default: false })
    verifiedPhonenNumber: boolean;

    @Column({ type: "text", nullable: true })
    fbId: string;

    @Column({ type: "text" })
    profilePhoto: string;

    @Column({type: "boolean", default: false})
    isDriving: boolean;

    @Column({type: "boolean", default: false})
    isRiding: boolean;

    @Column({type: "boolean", default: false})
    isTaken: boolean;

    @Column({ type: "double precision", default: 0 })
    lastLng: number;

    @Column({ type: "double precision", default: 0 })
    lastLat: number;

    @Column({ type: "double precision", default: 0 })
    lastOrientation: number;

    @ManyToOne(type => Chat, chat => chat.participants)
    chat: Chat;

    @OneToMany(type => Message, message => message.user)
    messages: Message;

    // fullname은 칼럼이 아니라 여기 있는 칼럼을 활용하는 메서드다.
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    // 패스워드가 일치하는지 Promise가 Boolean으로 리턴한다.
    public comparePassword(password: string): Promise<boolean> {
        // 사용자가 입력한 패스워드(password)와 지금 있는 패스워드(this)를 비교한다.
        return bcrypt.compare(password, this.password);
    }

    @BeforeInsert()
    @BeforeUpdate()
    async savePassword(): Promise<void>{
        if(this.password) {
            // 해시로 바꿀 때 까지 await 즉, 기다린다. 작업이 바로 이뤄지는 게 아니라 시간이 걸리기 때문.
            const hashedPassword = await this.hashPassword(this.password);
            // 작업이 끝나면 아래를 실행한다.
            // 지금 있는 패스워드와 해시값이 같은지 확인한다.
            this.password = hashedPassword;
        }
    }

    // promise를 리턴하는 함수. promise는 string 값을 준다.
    private hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, BCRYPT_ROUNDS);
    }

    @OneToMany(type => Verification, verification => verification.user)
    verification: Verification[];

    @OneToMany(type => Ride, ride => ride.passenger)
    ridesAsPassenger: Ride[];

    @OneToMany(type => Ride, ride => ride.driver)
    ridesAsDriver: Ride[];

    @CreateDateColumn() createdAt: string;
    @UpdateDateColumn() updatedAt: string;
}

export default User;