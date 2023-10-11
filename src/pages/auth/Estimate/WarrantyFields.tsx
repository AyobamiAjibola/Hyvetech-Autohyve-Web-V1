import React from 'react';
import { Grid, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { PartArgs } from '../EditEstimate';
// import SelectField from '.';

function WarrantyFields(props: PartArgs) {
  const index = props.index;
  const warranty = props.warranty;
  const handleChange = props.handleChange;
  const values = props.values;

  const data = [
    { label: 'day', value: 'day' },
    { label: 'week', value: 'week' },
    { label: 'month', value: 'month' },
    { label: 'year', value: 'year' },
  ]

  return (
    <React.Fragment>
      {Object.keys(warranty).map((value, idx) => {
        return (
          <Grid key={idx} item sm={1} xs={14} container>
            {value === 'warranty' && (
              <Grid item sm={12} xs={14}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={value}
                  type="number"
                  inputProps={{
                    min: '0',
                  }}
                  onChange={handleChange}
                  name={`parts.${index}.warranty.warranty`}
                  value={values.parts[index].warranty.warranty}
                />
              </Grid>
            )}
            {value === 'interval' && (
              <Grid item sm={12} xs={14}>
                {/* <SelectField
                  data={[
                    { label: 'day', value: 'day' },
                    { label: 'week', value: 'week' },
                    { label: 'month', value: 'month' },
                    { label: 'year', value: 'year' },
                  ]}
                  fullWidth
                  label={value}
                  onChange={handleChange}
                  name={`parts.${index}.warranty.interval`}
                  value={values.parts[index].warranty.interval}
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

export default WarrantyFields;
