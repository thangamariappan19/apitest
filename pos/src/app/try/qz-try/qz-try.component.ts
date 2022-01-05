import { Component, OnInit } from '@angular/core';
import { QzTrayService } from 'src/app/qz-tray-service';

@Component({
  selector: 'app-qz-try',
  templateUrl: './qz-try.component.html',
  styleUrls: ['./qz-try.component.css']
})
export class QzTryComponent implements OnInit {

  printerName = "EPSON TM-T88IV Receipt";
  
  constructor(private printService: QzTrayService) { }

  ngOnInit(): void {
    this.printService.initQZ();
  }
  onPrintHTML() {
		var colA = '<p style="font-weight: bold; font-size: 2mm;">Ticket 10001</p>';
		var colB = '<p>Php 1500.00</p>';
		var currentDate = new Date();

		var printData = [
			{
				type: 'html',
				format: 'plain',
				data: 
					`<html>
						<div style="width: 75mm;">
							<div style="width: 100%; text-align: center;">
								<h4 style="margin: 2mm 0mm">*&nbsp;SHOPPING MALL&nbsp;*</h4>
							</div>
							<table style="width: 90%; margin-left: 5%;">
								<tr style="padding: 0; margin: 0; margin-bottom: 1.5mm;">
									<td valign="top" style="width: 50%; font-weight: bold; font-size: 11px;">&nbsp;</td>
									<td valign="top" style="width: 50%; ">
										<div style="width: 100%; text-align: right; font-size: 11px;">
											<span>Date: 07/27/2018</span>
										</div>
									</td>
								</tr>
								<tr style="padding: 0; margin: 0; margin-bottom: 1mm;">
									<td valign="top" style="width: 50%;">
										<div style="width: 100%; text-align: center; font-size: 11px;">
											<span>Items</span>
										</div>
									</td>
									<td valign="top" style="width: 50%; ">
										<div style="width: 100%; text-align: center; font-size: 11px;">
											<span>Price</span>
										</div>
									</td>
								</tr>
								<tr style="padding: 0; margin: 0">
									<td valign="top" style="width: 50%; font-weight: bold; font-size: 11px;">Item 1</td>
									<td valign="top" style="width: 50%; ">
										<div style="width: 100%; text-align: right; font-size: 11px;">
											<span>Php 1000.00</span>
										</div>
									</td>
								</tr>
								<tr style="padding: 0; margin: 0">
									<td valign="top" style="width: 50%; font-weight: bold; font-size: 11px;">Item 2</td>
									<td valign="top" style="width: 50%; ">
										<div style="width: 100%; text-align: right; font-size: 11px;">
											<span>Php 1000.00</span>
										</div>
									</td>
								</tr>
								<tr style="padding: 0; margin: 0">
									<td valign="top" style="width: 50%; font-weight: bold; font-size: 11px;">Total</td>
									<td valign="top" style="width: 50%; ">
										<div style="width: 100%; text-align: right; font-weight: bold; font-size: 11px;">
											<span>Php 2000.00</span>
										</div>
									</td>
								</tr>
							</table>
							<div style="width: 100%; text-align: center;">
								<p style="font-size: 10px;">*This invoice is valid for 1 day</p>
							</div>
						</div>
					</html>`
			}
		];

		this.printService.printHTML(this.printerName, printData);
	}
	
	onPrint() {
		let printData = ['test_data', 'testing!!!'];

		this.printService.printData(this.printerName, printData);

		// this.printService.printData(this.printerName, printData)
		// 	.subscribe((data) => {
		// 		console.log(data);
		// 	},
		// 	(err) => {
		// 		console.log(err);
		// 	});
	}

	getPrinter() {
		this.printService.getPrinter(this.printerName);
		// this.printService.getPrinter(this.printerName)
		// 	.subscribe((data) => {
		// 		console.log(data);
		// 	},
		// 	(err) => {
		// 		console.log(err);
		// 	})
	}

	getPrinters() {
		this.printService.getPrinters();
		// this.printService.getPrinters()
		// 	.subscribe(data => console.log(data),
		// 	(err) => {
		// 		console.log(err);
		// 	});
	}
}
