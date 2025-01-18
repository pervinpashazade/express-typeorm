import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { EInquiryType } from "../../../DAL/models/contact.model";

export class CreateContactDTO {
  @IsDefined({ message: "Name is required" })
  @IsString()
  @MaxLength(25, { message: "Name is too long" })
  @MinLength(3, { message: "En az 3 simvol olmalidir" })
  name: string;

  @IsString()
  @MaxLength(25)
  surname: string;

  @IsEmail()
  @ValidateIf((o) => o.email !== "test@gmail.com")
  email: string;

  @IsString()
  companyName: string;

  @IsEnum(EInquiryType)
  inquiryType: EInquiryType;

  @IsString()
  message: string;
}

/* 

    [field_name]: ["errors", ...]

    error: {
        name: ["required", "minLength", "maxLength"],
        surname: ["required", "minLength", "maxLength"],
        age: ["required", "minLength", "maxLength"],
    }
    
*/
