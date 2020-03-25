import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {verificationTarget} from "../types/types";

@Entity()
class Verification extends BaseEntity {
    @PrimaryGeneratedColumn() id: number;

    // mail, Mail 등으로 혼동되지 않도록 타입을 설정한다.
    @Column({ type: "text", enum: ["PHONE", "EMAIL"] }) // target 타입 뿐만 아니라 여기에도 이중으로 타입을 막아준다.
    target: verificationTarget;

    @Column({ type: "text" })
    payload: string;

    @Column({ type: "text" })
    key: string;

    @Column({ type: "boolean", default: false })
    used: boolean;

    @CreateDateColumn() createdAt: string;
    @UpdateDateColumn() updatedAt: string;
}
export default Verification;