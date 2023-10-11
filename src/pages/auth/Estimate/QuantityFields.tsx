import React from 'react';
import { Grid, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { PartArgs } from '../EditEstimate';

function QuantityFields(props: PartArgs) {
  const index = props.index;
  const quantity = props.quantity;
  const handleChange = props.handleChange;
  const values = props.values;

  const data = [
    { label: 'pcs', value: 'pcs' },
    { label: 'pair', value: 'pair' },
    { label: 'litres', value: 'litres' },
    { label: 'set', value: 'set' },
    { label: 'kg', value: 'kg' },
    { label: 'hrs', value: 'hrs' },
    { label: 'kit', value: 'kit' },
  ]

  return (
    <React.Fragment>
      {Object.keys(quantity).map((value, idx) => {
        return (
          <Grid key={idx} item sm={1} xs={14} container spacing={0.2}>
            {value === 'quantity' && (
              <Grid item sm={12} xs={14}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={value}
                  type="number"
                  inputProps={{
                    min: '0',
                  }}
                  name={`parts.${index}.quantity.quantity`}
                  value={values.parts[index].quantity.quantity}
                  onChange={handleChange}
                />
              </Grid>
            )}
            {value === 'unit' && (
              <Grid item sm={12} xs={14}>
                {/* <SelectField
                  data={[
                    { label: 'pcs', value: 'pcs' },
                    { label: 'pair', value: 'pair' },
                    { label: 'litres', value: 'litres' },
                    { label: 'set', value: 'set' },
                    { label: 'kg', value: 'kg' },
                    { label: 'hrs', value: 'hrs' },
                    { label: 'kit', value: 'kit' },
                  ]}
                  fullWidth
                  label={value}
                  name={`parts.${index}.quantity.unit`}
                  value={values.parts[index].quantity.unit}
                  onChange={handleChange}
                /> */}
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name={`parts.${index}.warranty.interval`}
                  value={values.parts[index].warranty.interval}
                  label=""
                  onChange={handleChange}
                >
                  {data.map((value: any, index: number) => {
                    return (
                      <MenuItem key={index} value={value.value}>{value.label}</MenuItem>
                    )
                  })}
                </Select>
              </Grid>
            )}
          </Grid>
        );
      })}
    </React.Fragment>
  );
}

export default QuantityFields;
