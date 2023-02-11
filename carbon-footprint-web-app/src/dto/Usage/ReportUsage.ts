import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class ReportUsageDTO {
    @IsNotEmpty()
    @IsString()
    website_origin: string;

    @IsNotEmpty()
    @IsNumber()
    website_usage: number;

    constructor(webOrigin: string, webUsage: number) {
        this.website_origin = webOrigin;
        this.website_usage = webUsage;
    }
}
