import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class UsageReportDTO{
    @IsNotEmpty()
    @IsString()
    website_origin: string;

    @IsNotEmpty()
    @IsNumber()
    website_total_usage: number;

    @IsNotEmpty()
    @IsNumber()
    website_report_count: number

    constructor(webOrigin: string, webUsage: number, webReport: number) {
        this.website_origin = webOrigin
        this.website_total_usage = webUsage
        this.website_report_count = webReport
    }
}