import React, { useState } from 'react';
export const Rtl = () => {
  document.querySelector('body').classList.add('rtl');
  document.querySelector('body').classList.remove('ltr');
  document.querySelector("html").setAttribute("dir", "rtl");

  document.getElementById("bootstrapLink").href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.rtl.min.css";

  document.getElementById("myonoffswitch55").checked = true;
  localStorage.setItem("sparicrtl", true)
  localStorage.removeItem('sparicltr');
  localStorage.removeItem('spariclightMode')

}
export const Ltr = () => {
  document.querySelector('body').classList.remove('rtl');
  document.querySelector('body').classList.add('ltr');
  document.getElementById("bootstrapLink").href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
  document.querySelector("html").setAttribute("dir", "ltr");
  document.getElementById('myonoffswitch54').checked = true;
  localStorage.setItem('sparicltr', true)
  localStorage.removeItem('sparicrtl')
  localStorage.removeItem('spariclightmenu')
  localStorage.removeItem('spariclightheader')
}
//  
export const Darktheme = () => {
  document.querySelector('body').classList.add('dark-mode');
  document.querySelector('body').classList.remove('light-mode');
 
  document.getElementById('myonoffswitch2').checked = true;
  localStorage.setItem('sparicdarkMode', true)
  localStorage.removeItem('spariclightMode');


}
// export default Darktheme

export const Lightmode = () => {
  document.querySelector('body').classList.add('light-mode');
  document.querySelector('body').classList.remove('dark-mode');
  document.getElementById('myonoffswitch1').checked = true;
  localStorage.setItem('spariclightMode', true)
  localStorage.removeItem('sparicdarkMode');

  localStorage.removeItem('sparicrtl');
}


// LAYOUT WIDTH STYLES

export const Fullwidth = () => {
  document.querySelector('body').classList.remove('layout-boxed');
  document.getElementById('myonoffswitch9').checked = true;
  localStorage.setItem('sparicfullwidth', true);
  localStorage.removeItem('sparicboxedwidth')
}

export const Boxedwidth = () => {
  document.querySelector('body').classList.add('layout-boxed');
  document.querySelector('body').classList.remove('layout-fullwidth')
  document.getElementById('myonoffswitch10').checked = true;
  localStorage.setItem('sparicboxedwidth', true);
  localStorage.removeItem('sparicfullwidth');
  localStorage.removeItem('sparicfixed');
}

// LAYOUT POSITIONS
export const Fixed = () => {
  document.querySelector('body').classList.add('fixed-layout');
  document.querySelector('body').classList.remove('scrollable-layout');
  document.getElementById('myonoffswitch11').checked = true;
  localStorage.setItem('sparicfixed', true);
  localStorage.removeItem('sparicscrollable');
}
export const Scrollable = () => {
  document.querySelector('body').classList.add('scrollable-layout');
  document.querySelector('body').classList.remove('fixed-layout');
  document.getElementById('myonoffswitch12').checked = true;
  localStorage.setItem('sparicscrollable', true);
  localStorage.removeItem('sparicfixed');
}

//NAVIGATION STYLE
//Horizontal
export const Horizontalmenu = () => {


  localStorage.setItem('sparichorizontal', true)
  localStorage.removeItem('sparicvertical')
  localStorage.removeItem('sparichorizontalhover')
  document.querySelector('body').classList.add('horizontal');


  document.querySelector("body").classList.remove("horizontal-hover");





  document.querySelector('body').classList.remove('sidenav-toggled');
  document.querySelector('body').classList.remove('sidebar-mini');
  document.getElementById('myonoffswitch35').checked = true;

  // OpacityValuePrimary();

}

//Vertical
export const Verticalmenu = () => {


  localStorage.setItem('sparicvertical', true);
  localStorage.removeItem("sparichorizontal");
  localStorage.removeItem('sparichorizontalhover')
  document.querySelector('body').classList.remove('horizontal');
  document.querySelector('.main-content').classList.remove('horizontal-content');
  document.querySelector(".main-container").classList.remove("container");
  document.querySelector('.header').classList.remove('hor-header');
  document.querySelector('.app-sidebar').classList.remove('horizontal-main');
  document.querySelector(".side-app").classList.remove("container");
  document.querySelector(".main-sidemenu").classList.remove("container");

  document.querySelector("body").classList.remove("horizontal-hover");

  document.querySelector('.main-content').classList.add('app-content');
  document.querySelector(".main-container").classList.add("container-fluid");
  document.querySelector('.header').classList.add('app-header');
  document.querySelector('body').classList.add('horizontal-hover');
  document.querySelector('body').classList.add('sidebar-mini');


}

//HORIZONTALHOVERMENU
export const HorizontalHoverMenu = () => {

  localStorage.setItem('sparichorizontalhover', true)
  localStorage.removeItem('sparichorizontal');
  localStorage.removeItem('sparicvertical');
  document.querySelector("body").classList.add("horizontal-hover");

  document.querySelector("body").classList.add("horizontal");

  document.getElementById('myonoffswitch111').checked = true;



};

// Centerlogo
export const Centerlogo = () => {
  document.querySelector('body')?.classList.contains("horizontal" ,"horizontal horizontal-hover")
  document.querySelector('body').classList.add('center-logo')
  document.querySelector('body').classList.remove('default-logo')
  localStorage.setItem("spariccenterlogo", true)
  localStorage.removeItem("sparicdefaultlogo")
  document.getElementById("switchbtn-centerlogo").checked=true;
 }

 // Default logo
 export const Defaultlogo = () => {
  document.querySelector('body')?.classList.contains("horizontal" ,"horizontal horizontal-hover")
  document.querySelector('body').classList.add('default-logo')
  document.querySelector('body').classList.remove('center-logo')
  localStorage.setItem("sparicdefaultlogo", true)
  localStorage.removeItem("spariccenterlogo")
  document.getElementById("switchbtn-defaultlogo").checked=true;

 }



 const ColorPicker = (props) => {
  return (
    React.createElement("div", null,
      React.createElement("input", { type: "color", ...props })
    )
  );
};


function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
    : null;
}

export const ThemePrimaryColor = () => {
  const [state, updateState] = useState("#0162e8");

  const handleInput = (e) => {
    let { r, g, b } = hexToRgb(e.target.value);
    updateState(e.target.value);
    const rgbaValue = `rgba(${r}, ${g}, ${b}, 1)`;
    const rgbaValue005 = `rgba(${r}, ${g}, ${b}, 0.05)`;
    const rgbaValue1 = `rgba(${r}, ${g}, ${b}, 0.1)`;
    const rgbaValue2 = `rgba(${r}, ${g}, ${b}, 0.2)`;
    const rgbaValue3 = `rgba(${r}, ${g}, ${b}, 0.3)`;
    const rgbaValue4 = `rgba(${r}, ${g}, ${b}, 0.4)`;
    const rgbaValue5 = `rgba(${r}, ${g}, ${b}, 0.5)`;
    const rgbaValue6 = `rgba(${r}, ${g}, ${b}, 0.6)`;
    const rgbaValue7 = `rgba(${r}, ${g}, ${b}, 0.7)`;
    const rgbaValue8 = `rgba(${r}, ${g}, ${b}, 0.8)`;
    const rgbaValue9 = `rgba(${r}, ${g}, ${b}, 0.9)`;
    const rgbaValue10 = `rgba(${r}, ${g}, ${b}, 0.58)`;
    const rgbaValue11 = `rgba(${r}, ${g}, ${b}, 1)`;




    document.documentElement.style.setProperty("--primary01", rgbaValue1);
    document.documentElement.style.setProperty("--primary02", rgbaValue2);
    document.documentElement.style.setProperty("--primary03", rgbaValue3);
    document.documentElement.style.setProperty("--primary04", rgbaValue4);
    document.documentElement.style.setProperty("--primary05", rgbaValue5);
    document.documentElement.style.setProperty("--primary06", rgbaValue6);
    document.documentElement.style.setProperty("--primary07", rgbaValue7);
    document.documentElement.style.setProperty("--primary08", rgbaValue8);
    document.documentElement.style.setProperty("--primary09", rgbaValue9);
    document.documentElement.style.setProperty("--primary005", rgbaValue005);
    document.documentElement.style.setProperty("--primary-bg-color", rgbaValue);
    document.documentElement.style.setProperty("--primary-bg-hover", rgbaValue10);
    document.documentElement.style.setProperty("--primary-bg-border", rgbaValue11);

    localStorage.setItem("sparicprimarycolor", rgbaValue);
    localStorage.setItem("sparicprimarybordercolor", rgbaValue11);
    localStorage.setItem("sparicprimaryhovercolor", rgbaValue10);



  };

  return (
    <div className="ThemePrimaryColor">
      <ColorPicker onChange={handleInput} value={state} />
      <div className="my-bootstrap-component" style={{ backgroundColor: 'var rgba(--primary-color)' }} >
    
      </div>
    </div>
  );
};




export const Backgroundcolor = () => {
  const [state, updateState] = useState("#373c56");

  const handleInput = (e) => {
    let { r, g, b } = hexToRgb(e.target.value);
    updateState(e.target.value);
    const rgbaValue = `rgba(${r}, ${g}, ${b})`;
    const rgbaValue005 = `rgba(${r}, ${g}, ${b}, 0.05)`;
    const rgbaValue1 = `rgba(${r}, ${g}, ${b}, 0.1)`;
    const rgbaValue2 = `rgba(${r}, ${g}, ${b}, 0.2)`;
    const rgbaValue3 = `rgba(${r}, ${g}, ${b}, 0.3)`;
    const rgbaValue4 = `rgba(${r}, ${g}, ${b}, 0.4)`;
    const rgbaValue5 = `rgba(${r}, ${g}, ${b}, 0.5)`;
    const rgbaValue6 = `rgba(${r}, ${g}, ${b}, 0.6)`;
    const rgbaValue7 = `rgba(${r}, ${g}, ${b}, 0.7)`;
    const rgbaValue8 = `rgba(${r}, ${g}, ${b}, 0.8)`;
    const rgbaValue9 = `rgba(${r}, ${g}, ${b}, 0.9)`;
    const rgbaValue10 = `rgba(${r}, ${g}, ${b}, 0.87)`;





    document.documentElement.style.setProperty("--primary01", rgbaValue1);
    document.documentElement.style.setProperty("--primary02", rgbaValue2);
    document.documentElement.style.setProperty("--primary03", rgbaValue3);
    document.documentElement.style.setProperty("--primary04", rgbaValue4);
    document.documentElement.style.setProperty("--primary05", rgbaValue5);
    document.documentElement.style.setProperty("--primary06", rgbaValue6);
    document.documentElement.style.setProperty("--primary07", rgbaValue7);
    document.documentElement.style.setProperty("--primary08", rgbaValue8);
    document.documentElement.style.setProperty("--primary09", rgbaValue9);
    document.documentElement.style.setProperty("--primary005", rgbaValue005);
    document.documentElement.style.setProperty("--dark-body", rgbaValue10);
    document.documentElement.style.setProperty("--dark-theme", rgbaValue);




    localStorage.setItem("sparicbgcolor", rgbaValue);
    localStorage.setItem("sparicthemecolor", rgbaValue10);
    localStorage.setItem("sparicdarkMode", true);


    document.querySelector('body').classList.add('dark-mode');
    document.querySelector('body').classList.remove('light-mode');
    document.querySelector('body').classList.remove('light-menu');
    document.querySelector('body').classList.remove('color-menu');
    document.querySelector('body').classList.remove('dark-menu');
    document.querySelector('body').classList.remove('light-header');
    document.querySelector('body').classList.remove('color-header');
    document.querySelector('body').classList.remove('dark-header');
    document.getElementById('myonoffswitch2').checked = true;
    document.getElementById('myonoffswitch5').checked = true;
    document.getElementById('myonoffswitch8').checked = true;
    localStorage.removeItem('spariclightMode');
    localStorage.removeItem('spariclightheader');
    localStorage.removeItem('spariclighmenu');




  };

  return (
    <div className="ThemePrimaryColor">
      <ColorPicker onChange={handleInput} value={state} />
      <div className="my-bootstrap-component" style={{ backgroundColor: 'var rgba(--primary-color)' }}>

      </div>
    </div>
  );
};

//Localbackup
export const LocalBackup = () => {
  let html = document.querySelector("html").style;
  let body = document.querySelector("body");
  (localStorage.sparicltr) && Ltr();
  (localStorage.sparicrtl) && Rtl();
  (localStorage.spariclightMode) && Lightmode();
  (localStorage.sparicdarkMode) && Darktheme();
  (localStorage.sparicfullwidth) && Fullwidth();
  (localStorage.sparicboxedwidth) && Boxedwidth();
  (localStorage.sparicfixed) && Fixed();
  (localStorage.sparicscrollable) && Scrollable();
  (localStorage.sparichorizontal) && Horizontalmenu();
  (localStorage.sparicvertical) && Verticalmenu();
  (localStorage.sparichorizontalhover) && HorizontalHoverMenu();

  if (localStorage.getItem("sparicprimarycolor") !== null) {
    body.classList.add("light-mode");

    // let ltr = document.getElementById("myonoffswitch6")
    // ltr.checked = true;

    body.classList.remove("dark-mode");
    body.classList.remove("transparent-mode");
    html.setProperty(
      "--primary-bg-color",
      localStorage.getItem("sparicprimarycolor")
    );
    html.setProperty(
      "--primary-bg-hover",
      localStorage.getItem("sparicprimaryhovercolor")
    );
    html.setProperty(
      "--primary-bg-border",
      localStorage.getItem("sparicprimarybordercolor")
    );

  }


  if (localStorage.getItem("sparicbgcolor") !== null) {
    body.classList.add("dark-mode");

    // let ltr = document.getElementById("myonoffswitch2")
    // ltr.checked = true;

    body.classList.remove("light-mode");
    body.classList.remove("transparent-mode");

    html.setProperty(
      "--dark-body",
      localStorage.getItem("sparicbgcolor")
    );
    html.setProperty(
      "--dark-theme",
      localStorage.getItem("sparicthemecolor")
    );

  }
  // (localStorage.spariccenterlogo) && Centerlogo();
  //  (localStorage.sparicdefaultlogo) && Defaultlogo();


}

// resetall
export const Resetall = () => {
  localStorage.clear();
  localStorage.getItem('sparicltr', true);
  document.querySelector('body').classList.add('light-mode');
  document.querySelector('body').classList.remove('rtl');
  document.querySelector('body').classList.remove('layout-boxed');
  document.querySelector('body').classList.remove('scrollable-layout');
  document.querySelector('body').classList.remove('dark-mode');

  document.getElementById('myonoffswitch1').checked = true;
  document.getElementById('myonoffswitch54').checked = true;
 
  document.getElementById("myonoffswitch34").checked = true;
  document.getElementById("myonoffswitch11").checked = true;
  document.getElementById("myonoffswitch9").checked = true;
  
  
  document.querySelector("html[lang=en]").setAttribute("dir", "ltr");
  document.querySelector("html[lang=en]").removeAttribute("style");
  document.getElementById("bootstrapLink").href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
  


  document.querySelector('body').classList.remove('horizontal');
  document.querySelector('.main-content').classList.remove('horizontal-content');
  document.querySelector(".main-container").classList.remove("container");
  document.querySelector('.header').classList.remove('hor-header');
  document.querySelector('.app-sidebar').classList.remove('horizontal-main');
  document.querySelector(".side-app").classList.remove("container");
  document.querySelector(".main-sidemenu").classList.remove("container");



  document.querySelector(".app").classList.add("sidebar-mini");
  document.querySelector(".header").classList.add("app-header");
  document.querySelector(".main-content").classList.add("app-content");
  document.querySelector(".main-container").classList.add("container-fluid");

  // document.querySelector("body").classList.remove("horizontal-hover");

  // document.querySelector('body').classList.remove('default-logo')
  // document.querySelector('body').classList.remove('center-logo');

}

//horizontalmenusticky
export const horizontalmenusticky = () => {
  if (window.scrollY > 30 && document.querySelector(".app-sidebar")) {
    let Scolls = document.querySelectorAll(".app-sidebar");
    Scolls.forEach((e) => {
      e.classList.add("fixed-header");
    });
  } else {
    let Scolls = document.querySelectorAll(".app-sidebar");
    Scolls.forEach((e) => {
      e.classList.remove("fixed-header");
    });
  }
};
window.addEventListener("scroll", horizontalmenusticky);




