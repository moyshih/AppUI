import React from 'react'
import Vehicle from '../common/interfaces/Vehicle';

interface VehicleDataPresenterProps {
    vehicle: Vehicle
}

const VehicleDataPresenter: React.FC<VehicleDataPresenterProps> = ({ vehicle }) => {
    return (
        <div className="vehicle-container">
            <div className="field">
                Type: {vehicle.Type ?? 'missing :('}
            </div>
            <div className="field">
                Color: {vehicle.Color ?? 'missing :('}
            </div>
            <div className="field">
                Plate Number: {vehicle.PlateNumber ?? 'missing :('}
            </div>
            <div className="field">
                Creation Time: {vehicle.Timestamp.toLocaleString() ?? 'missing :('}
            </div>
        </div>
    )
}

export default VehicleDataPresenter;