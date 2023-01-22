import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Reservation } from './dto/reservation';
import { ReservationService } from './reservation.service';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent implements AfterViewInit {
  title = 'reservations';
  displayedColumns: string[] = ['name', 'roomNumber', 'reservationDates', 'actions'];
  dataSource: any;
  updateIdentifier: number | undefined;
  minDate!: Date;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  form: any;



  constructor(
    public reservationService: ReservationService,
    private formBuilder: FormBuilder
  ) {

    this.minDate = new Date();

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      roomNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });

  }

  ngAfterViewInit() {
    this.findByAll();
  }


  findByAll() {
    this.reservationService.findByAll().subscribe((res) => {
      this.dataSource = new MatTableDataSource<Reservation>(res.data);
      this.dataSource.paginator = this.paginator;
    });
  }


  onSubmit(): void {

    if (this.form.valid) {

      let reservation: Reservation = {
        id: this.updateIdentifier,
        clientFullName: this.form.get('name')?.value,
        roomNumber: Number(this.form.get('roomNumber')?.value),
        reservationDates: [this.form.get('startDate')?.value!, this.form.get('endDate')?.value!]
      }

      this.reservationService.post(reservation).subscribe({
        complete: () => {
          this.updateIdentifier = undefined;
          this.findByAll();
        },
        error: (err) => {
          this.updateIdentifier = undefined;
        }
      });

      this.form.reset();

    }else{
      console.log("Error en el formulario");
      Object.keys(this.form.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.form.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
           console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      
    });

  }
  }

  edit(element: Reservation): void {
    this.updateIdentifier = element.id!;
    this.form.get('name')?.setValue(element.clientFullName!);
    this.form.get('roomNumber')?.setValue(element.roomNumber!.toString());
    this.form.get('startDate')?.setValue(element.reservationDates![0]);
    this.form.get('endDate')?.setValue(element.reservationDates![1]);
  }

}
