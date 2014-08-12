using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AngularTutorialTodo.Models
{
    public class Todo
    {
        public int Id { get; set; }
        public string TodoItem { get; set; }
        public int Priority { get; set; }
        public DateTime? DueDate { get; set; }
    }
}