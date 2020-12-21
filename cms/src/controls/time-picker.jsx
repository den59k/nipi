import React, { Fragment } from 'react'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
import { StringMonth } from 'libs/rus'

Date.prototype.daysInMonth = function() {
	return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

Date.prototype.daysInLastMonth = function() {
	return 33 - new Date(this.getFullYear(), this.getMonth()-1, 33).getDate();
};

function sw (i){
	const a = i.toString();
	if(a.length < 2)
		return "0"+a;
	else
		return a;
}
export default function TimePicker({label, form, name, time}){
	
	const value = form.get(name) || 0;
	let date = new Date(Math.floor(value/1000/60/5)*1000*5*60);
	if(time)
		date = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

	const onChange = (delta) => {
		form.onChange({ [name]: value+delta*1000*60 })
		//props.onChange({[props.name]: (val + delta + offset) * 1000 * 60});
	}	

	return (
		<div className="time-picker">
			<label style={{marginRight: "5px"}}>{label}</label>
			{!time && (
				<Fragment>
					<Picker value={date.getDate()} onChange={onChange} divider={60*24}/>
					<Picker value={StringMonth(date.getMonth())} onChange={onChange} 
						divider={date.daysInMonth()*60*24} dividerDec={date.daysInLastMonth()*60*24} style={{minWidth: "130px"}}/>
					<Picker value={date.getFullYear()} onChange={onChange} divider={60*24*365}/>
					<span style={{margin: "0 15px", fontSize: "20px"}}>-</span>
				</Fragment>
			)}
			<Picker value={date.getHours()} onChange={onChange} divider={60}/>
			<span>:</span>
			<Picker value={sw(date.getMinutes())} onChange={onChange} divider={5}/>
		</div>
	);
}

function Picker (props){

	const inc = (e) => {
		e.preventDefault();
		props.onChange(props.divider);
	}

	const dec = (e) => {
		e.preventDefault();
		props.onChange(-(props.dividerDec || props.divider));
	}

	return (
		<div className="picker" style={props.style}>
			<button onClick={inc}><IoIosArrowUp/></button>
			<div>{props.items?props.items[props.value]:props.value}</div>
			<button onClick={dec}><IoIosArrowDown/></button>
		</div>
	);

}